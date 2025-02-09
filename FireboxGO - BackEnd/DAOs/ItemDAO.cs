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
            Dictionary<int, ItemModel> itemDictionary = new Dictionary<int, ItemModel>();

            string sqlStatement = "SELECT fireboxgo.items.ID, fireboxgo.items.ITEM_NAME, fireboxgo.items.PURCHASE_DATE, fireboxgo.items.PURCHASE_PRICE, fireboxgo.items.RETAIL_PRICE, fireboxgo.items.DESCRIPTION, fireboxgo.items.OWNERSHIP_AGE, fireboxgo.items.IMAGE, fireboxgo.tags.TAG_NAME FROM fireboxgo.items LEFT JOIN fireboxgo.item_taggings ON fireboxgo.items.ID = fireboxgo.item_taggings.items_ID LEFT JOIN fireboxgo.tags ON fireboxgo.item_taggings.tags_ID = fireboxgo.tags.ID WHERE fireboxgo.items.rooms_ID = @rooms_ID";


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
                            int itemID = reader.GetInt32("ID");
                            string itemName = reader.GetString("ITEM_NAME");
                            DateOnly purchaseDate = DateOnly.FromDateTime(reader.GetDateTime("PURCHASE_DATE"));
                            decimal purchasePrice = reader.GetDecimal("PURCHASE_PRICE");
                            decimal retailPrice = reader.GetDecimal("RETAIL_PRICE");
                            string description = reader.GetString("DESCRIPTION");
                            int ownershipAge = reader.GetInt32("OWNERSHIP_AGE");
                            byte[] itemImage = reader["IMAGE"] as byte[];
                            string tagName = reader.IsDBNull(reader.GetOrdinal("TAG_NAME")) ? null : reader.GetString("TAG_NAME");

                            // Tie retrieved tags to their given item by itemID
                            if (!itemDictionary.ContainsKey(itemID))
                            {
                                itemDictionary[itemID] = new ItemModel
                                {
                                    ID = itemID,
                                    itemName = itemName,
                                    purchaseDate = purchaseDate,
                                    purchasePrice = purchasePrice,
                                    retailPrice = retailPrice,
                                    description = description,
                                    ownershipAge = ownershipAge,
                                    itemTags = new List<string>(),
                                    itemImage = itemImage,
                                    folderID = folderID,
                                    userID = userID
                                };
                            }

                            if (tagName != null)
                            {
                                itemDictionary[itemID].itemTags.Add(tagName);
                            }
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
            items.AddRange(itemDictionary.Values);
            return items;
        }

        // Create function for items
        public bool CreateItem(ItemModel item, int userID)
        {
            bool status = false;
            List<int> tagIDs = new List<int>();
            long newItemID = 0;

            string sqlInsertStatement = "INSERT INTO fireboxgo.items (ITEM_NAME, PURCHASE_DATE, PURCHASE_PRICE, RETAIL_PRICE, DESCRIPTION, OWNERSHIP_AGE, IMAGE, rooms_ID, accounts_ID) VALUES (@ITEM_NAME, @PURCHASE_DATE, @PURCHASE_PRICE, @RETAIL_PRICE, @DESCRIPTION, @OWNERSHIP_AGE, @IMAGE, @rooms_ID, @accounts_ID)";

            string sqlTagStatement = "SELECT ID FROM fireboxgo.tags WHERE TAG_NAME = @TAG_NAME";

            string sqlTaggingsStatement = "INSERT INTO fireboxgo.item_taggings (items_ID, tags_ID, accounts_ID) VALUES (@items_ID, @tags_ID, @accounts_ID)";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Perform function and add parameters for the items table
                    MySqlCommand commandInsert = new MySqlCommand(sqlInsertStatement, connection);
                    commandInsert.Parameters.AddWithValue("@ITEM_NAME", item.itemName);
                    commandInsert.Parameters.AddWithValue("@PURCHASE_DATE", item.purchaseDate.ToString("yyyy-MM-dd"));
                    commandInsert.Parameters.AddWithValue("@PURCHASE_PRICE", item.purchasePrice);
                    commandInsert.Parameters.AddWithValue("@RETAIL_PRICE", item.retailPrice);
                    commandInsert.Parameters.AddWithValue("@DESCRIPTION", item.description);
                    commandInsert.Parameters.AddWithValue("@OWNERSHIP_AGE", item.ownershipAge);
                    commandInsert.Parameters.AddWithValue("@IMAGE", item.itemImage);
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

                    // Perform function and add parameters for the items table
                    MySqlCommand commandUpdate = new MySqlCommand(sqlUpdateStatement, connection);
                    commandUpdate.Parameters.AddWithValue("@ITEM_NAME", item.itemName);
                    commandUpdate.Parameters.AddWithValue("@PURCHASE_DATE", item.purchaseDate.ToString("yyyy-MM-dd"));
                    commandUpdate.Parameters.AddWithValue("@PURCHASE_PRICE", item.purchasePrice);
                    commandUpdate.Parameters.AddWithValue("@RETAIL_PRICE", item.retailPrice);
                    commandUpdate.Parameters.AddWithValue("@DESCRIPTION", item.description);
                    commandUpdate.Parameters.AddWithValue("@OWNERSHIP_AGE", item.ownershipAge);
                    commandUpdate.Parameters.AddWithValue("@IMAGE", item.itemImage);
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