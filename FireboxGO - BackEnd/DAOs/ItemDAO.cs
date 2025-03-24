using FireboxGo.Models;
using MySql.Data.MySqlClient;
using Mysqlx.Crud;
using MySqlX.XDevAPI.Common;
using Org.BouncyCastle.Asn1.X509;
using static System.Net.Mime.MediaTypeNames;

namespace FireboxGo.DAOs
{
    public class ItemDAO
    {
        private string connectionString = "Server=localhost;port=3306;UserID=root;Password=root;Database=fireboxgo";

        // Read function for items
        public List<ItemModel> GetItems(int userID, int folderID)
        {
            List<ItemModel> items = new List<ItemModel>();
            ItemModel newItem = new ItemModel();

            string sqlStatement = "SELECT fireboxgo.items.ID, fireboxgo.items.ITEM_NAME, fireboxgo.items.PURCHASE_DATE, fireboxgo.items.PURCHASE_PRICE, fireboxgo.items.RETAIL_PRICE, fireboxgo.items.DESCRIPTION, fireboxgo.items.OWNERSHIP_AGE, fireboxgo.items.IMAGE, GROUP_CONCAT(tags.TAG_NAME ORDER BY tags.TAG_NAME SEPARATOR ', ') AS Tags FROM fireboxgo.items LEFT JOIN fireboxgo.item_taggings ON items.ID = item_taggings.items_ID LEFT JOIN fireboxgo.tags ON item_taggings.tags_ID = tags.ID WHERE items.accounts_ID = @accounts_ID AND items.rooms_ID = @rooms_ID GROUP BY items.ID, items.ITEM_NAME, items.PURCHASE_DATE, items.PURCHASE_PRICE, items.RETAIL_PRICE, items.DESCRIPTION, items.OWNERSHIP_AGE, items.IMAGE, items.rooms_ID ORDER BY ITEM_NAME ASC";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Perform function and add parameters
                    MySqlCommand command = new MySqlCommand(sqlStatement, connection);
                    command.Parameters.AddWithValue("@accounts_ID", userID);
                    command.Parameters.AddWithValue("@rooms_ID", folderID);
                    MySqlDataReader reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            List<string> tags = new List<string>();
                            byte[] itemData = new byte[0];
                            string itemImage = "";
                            string tagsString = reader.IsDBNull(8) ? string.Empty : reader.GetString(8);

                            if (!reader.IsDBNull(7))
                            {
                                // Handle the image bytes
                                long byteCount = reader.GetBytes(7, 0, null, 0, 0);
                                if (byteCount > 0)
                                {
                                    itemData = new byte[byteCount];
                                    reader.GetBytes(7, 0, itemData, 0, (int)byteCount);
                                    itemImage = Convert.ToBase64String(itemData);
                                }
                                else
                                {
                                    itemData = new byte[0];
                                }
                            }

                            // Get the tags and store them in a list for the item model
                            string[] tagsArray = tagsString.Split(',');
                            foreach (var tag in tagsArray)
                            {
                                string trimmedTag = tag.Trim();
                                if (!string.IsNullOrEmpty(trimmedTag))
                                {
                                    tags.Add(trimmedTag);
                                }
                            }

                            // Add item to results
                            items.Add(
                                newItem = new ItemModel(
                                    reader.GetInt32(0),
                                    reader.GetString(1),
                                    DateOnly.FromDateTime(reader.GetDateTime(2)),
                                    reader.GetDecimal(3),
                                    reader.GetDecimal(4),
                                    reader.GetString(5),
                                    reader.GetInt32(6),
                                    tags,
                                    itemImage,
                                    folderID,
                                    userID
                                )
                            );
                        }
                    }
                    reader.Close();
                    connection.Close();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
            return items;
        }

        // Create function for items
        public bool CreateItem(ItemModel item, int userID)
        {
            bool status = false;
            List<int> tagIDs = new List<int>();
            long newItemID = 0;

            byte[] imageBytes = Convert.FromBase64String(item.itemImage);

            string sqlPacketStatement = "SET GLOBAL max_allowed_packet = 1073741824;";

            string sqlInsertStatement = "INSERT INTO fireboxgo.items (ITEM_NAME, PURCHASE_DATE, PURCHASE_PRICE, RETAIL_PRICE, DESCRIPTION, OWNERSHIP_AGE, IMAGE, rooms_ID, accounts_ID) VALUES (@ITEM_NAME, @PURCHASE_DATE, @PURCHASE_PRICE, @RETAIL_PRICE, @DESCRIPTION, @OWNERSHIP_AGE, @IMAGE, @rooms_ID, @accounts_ID)";

            string sqlTagStatement = "SELECT ID FROM fireboxgo.tags WHERE TAG_NAME = @TAG_NAME";

            string sqlTaggingsStatement = "INSERT INTO fireboxgo.item_taggings (items_ID, tags_ID, accounts_ID) VALUES (@items_ID, @tags_ID, @accounts_ID)";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Allow for max 10GB files
                    MySqlCommand packetIncrease = new MySqlCommand(sqlPacketStatement, connection);
                    packetIncrease.ExecuteNonQuery();

                    // Perform function and add parameters for the items table
                    MySqlCommand commandInsert = new MySqlCommand(sqlInsertStatement, connection);
                    commandInsert.Parameters.AddWithValue("@ITEM_NAME", item.itemName);
                    commandInsert.Parameters.AddWithValue("@PURCHASE_DATE", item.purchaseDate.ToString("yyyy-MM-dd"));
                    commandInsert.Parameters.AddWithValue("@PURCHASE_PRICE", item.purchasePrice);
                    commandInsert.Parameters.AddWithValue("@RETAIL_PRICE", item.retailPrice);
                    commandInsert.Parameters.AddWithValue("@DESCRIPTION", item.description);
                    commandInsert.Parameters.AddWithValue("@OWNERSHIP_AGE", item.ownershipAge);
                    commandInsert.Parameters.AddWithValue("@IMAGE", imageBytes);
                    commandInsert.Parameters.AddWithValue("@rooms_ID", item.folderID);
                    commandInsert.Parameters.AddWithValue("@accounts_ID", userID);
                    commandInsert.ExecuteNonQuery();

                    newItemID = commandInsert.LastInsertedId;

                    // Get tag IDs
                    for (int i = 0; i < item.itemTags.Count(); i++)
                    {
                        MySqlCommand commandTag = new MySqlCommand(sqlTagStatement, connection);
                        commandTag.Parameters.AddWithValue("@TAG_NAME", item.itemTags[i]);
                        MySqlDataReader reader = commandTag.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                tagIDs.Add(reader.GetInt32(0));
                            }
                        }
                        reader.Close();
                    }

                    // Perform function and add parameters for the taggings table
                    for (int i = 0; i < tagIDs.Count(); i++)
                    {
                        MySqlCommand commandTagging = new MySqlCommand(sqlTaggingsStatement, connection);
                        commandTagging.Parameters.AddWithValue("@items_ID", newItemID);
                        commandTagging.Parameters.AddWithValue("@tags_ID", tagIDs[i]);
                        commandTagging.Parameters.AddWithValue("@accounts_ID", userID);
                        commandTagging.ExecuteNonQuery();
                    }

                    status = true;
                    connection.Close();
                    return status;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }

            return status;
        }

        // Update function for items
        public bool UpdateItem(ItemModel item, int userID, int itemID)
        {
            bool status = false;
            List<int> currentTags = new List<int>();
            List<int> newTags = new List<int>();
            List<int> tagsToRemove = new List<int>();
            List<int> tagsToAdd = new List<int>();

            byte[] imageBytes = Convert.FromBase64String(item.itemImage);

            string sqlPacketStatement = "SET GLOBAL max_allowed_packet = 1073741824;";

            string sqlUpdateStatement = "UPDATE fireboxgo.items SET ITEM_NAME = @ITEM_NAME, PURCHASE_DATE = @PURCHASE_DATE, PURCHASE_PRICE = @PURCHASE_PRICE, RETAIL_PRICE = @RETAIL_PRICE, DESCRIPTION = @DESCRIPTION, OWNERSHIP_AGE = @OWNERSHIP_AGE, IMAGE = @IMAGE, rooms_ID = @rooms_ID WHERE ID = @ID";

            string sqlTagStatement = "SELECT ID FROM fireboxgo.tags WHERE TAG_NAME = @TAG_NAME";

            string sqlTaggingStatement = "SELECT tags_ID FROM fireboxgo.item_taggings WHERE items_ID = @items_ID";

            string sqlDeleteStatement = "DELETE FROM fireboxgo.item_taggings WHERE items_ID = @items_ID AND tags_ID = @tags_ID";

            string sqlInsertStatement = "INSERT INTO fireboxgo.item_taggings (items_ID, tags_ID, accounts_ID) VALUES (@items_ID, @tags_ID, @accounts_ID)";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Allow for max 10GB files
                    MySqlCommand packetIncrease = new MySqlCommand(sqlPacketStatement, connection);
                    packetIncrease.ExecuteNonQuery();

                    // Perform function and add parameters for the items table
                    MySqlCommand commandUpdate = new MySqlCommand(sqlUpdateStatement, connection);
                    commandUpdate.Parameters.AddWithValue("@ITEM_NAME", item.itemName);
                    commandUpdate.Parameters.AddWithValue("@PURCHASE_DATE", item.purchaseDate.ToString("yyyy-MM-dd"));
                    commandUpdate.Parameters.AddWithValue("@PURCHASE_PRICE", item.purchasePrice);
                    commandUpdate.Parameters.AddWithValue("@RETAIL_PRICE", item.retailPrice);
                    commandUpdate.Parameters.AddWithValue("@DESCRIPTION", item.description);
                    commandUpdate.Parameters.AddWithValue("@OWNERSHIP_AGE", item.ownershipAge);
                    commandUpdate.Parameters.AddWithValue("@IMAGE", imageBytes);
                    commandUpdate.Parameters.AddWithValue("@rooms_ID", item.folderID);
                    commandUpdate.Parameters.AddWithValue("@ID", itemID);
                    commandUpdate.ExecuteNonQuery();

                    for (int i = 0; i < item.itemTags.Count(); i++)
                    {
                        // Get tag IDs
                        MySqlCommand commandTag = new MySqlCommand(sqlTagStatement, connection);
                        commandTag.Parameters.AddWithValue("@TAG_NAME", item.itemTags[i]);
                        MySqlDataReader readerTag = commandTag.ExecuteReader();
                        if (readerTag.HasRows)
                        {
                            while (readerTag.Read())
                            {
                                newTags.Add(readerTag.GetInt32(0));
                            }
                        }
                        readerTag.Close();
                    }

                    // Get tagging names based on tagIDs
                    MySqlCommand commandTagging = new MySqlCommand(sqlTaggingStatement, connection);
                    commandTagging.Parameters.AddWithValue("@items_ID", itemID);
                    MySqlDataReader readerTagging = commandTagging.ExecuteReader();
                    if (readerTagging.HasRows)
                    {
                        while (readerTagging.Read())
                        {
                            currentTags.Add(readerTagging.GetInt32(0));
                        }
                    }
                    readerTagging.Close();

                    // Compare new tags and old tags
                    tagsToRemove = currentTags.Except(newTags).ToList();
                    if (tagsToRemove.Count > 0)
                    {
                        for (int i = 0; i < tagsToRemove.Count; i++)
                        {
                            // Delete tags no longer assigned to the item
                            MySqlCommand commandRemove = new MySqlCommand(sqlDeleteStatement, connection);
                            commandRemove.Parameters.AddWithValue("@items_ID", itemID);
                            commandRemove.Parameters.AddWithValue("@tags_ID", tagsToRemove[i]);
                            commandRemove.ExecuteNonQuery();
                        }
                    }

                    // Compare old tags and new tags
                    tagsToAdd = newTags.Except(currentTags).ToList();
                    if (tagsToAdd.Count > 0)
                    {
                        for (int i = 0; i < tagsToAdd.Count; i++)
                        {
                            // Add tags now assigned to the item
                            MySqlCommand commandAdd = new MySqlCommand(sqlInsertStatement, connection);
                            commandAdd.Parameters.AddWithValue("@items_ID", itemID);
                            commandAdd.Parameters.AddWithValue("@tags_ID", tagsToAdd[i]);
                            commandAdd.Parameters.AddWithValue("@accounts_ID", userID);
                            commandAdd.ExecuteNonQuery();
                        }
                    }

                    status = true;
                    connection.Close();
                    return status;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }

            return status;
        }

        // Delete function for items
        public bool DeleteItem(int itemID)
        {
            bool status = false;

            string sqlChildStatement = "DELETE FROM fireboxgo.item_taggings WHERE items_ID = @items_ID";

            string sqlParentStatement = "DELETE FROM fireboxgo.items WHERE ID = @ID";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Perform function and add parameters for the taggings table first
                    MySqlCommand commandTagging = new MySqlCommand(sqlChildStatement, connection);
                    commandTagging.Parameters.AddWithValue("@items_ID", itemID);
                    commandTagging.ExecuteNonQuery();

                    // Perform function and add parameters for the items table next
                    MySqlCommand commandItem = new MySqlCommand(sqlParentStatement, connection);
                    commandItem.Parameters.AddWithValue("@ID", itemID);
                    commandItem.ExecuteNonQuery();

                    status = true;
                    connection.Close();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }

            return status;
        }

        // Read function for total room value across a given folder by folderID
        public decimal GetRoomValue(int folderID)
        {
            decimal roomValue = 0;

            string sqlStatement = "SELECT SUM(fireboxgo.items.RETAIL_PRICE) AS total_price FROM fireboxgo.items WHERE rooms_ID = @rooms_ID";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Perform function and add parameters
                    MySqlCommand command = new MySqlCommand(sqlStatement, connection);
                    command.Parameters.AddWithValue("@rooms_ID", folderID);
                    MySqlDataReader reader = command.ExecuteReader();
                    
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            roomValue = reader.GetInt32(0);
                        }
                    }
                    reader.Close();
                    connection.Close();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
            return roomValue;
        }
    }
}