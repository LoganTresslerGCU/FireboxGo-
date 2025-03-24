using FireboxGo.Models;
using FireboxGo.Security;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MySql.Data.MySqlClient;
using Mysqlx.Crud;
using System.Diagnostics;
using System.Text.RegularExpressions;
using System.Xml.Linq;

namespace FireboxGo.DAOs
{
    public class UserDAO
    {
        private SecurityHasher securityHasher = new SecurityHasher();

        private string connectionString = "Server=localhost;port=3306;UserID=root;Password=root;Database=fireboxgo";

        // Login function for users
        public int Login(UserModel user)
        {
            int status = 0;

            string sqlStatement = "SELECT * FROM fireboxgo.accounts WHERE USERNAME = @USERNAME";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                // Perform function and add parameters
                MySqlCommand command = new MySqlCommand(sqlStatement, connection);
                command.Parameters.AddWithValue("@USERNAME", user.username);

                try
                {
                    connection.Open();
                    MySqlDataReader readerLogin = command.ExecuteReader();

                    if (readerLogin.HasRows)
                    {
                        readerLogin.Read();

                        // Compare inputted password with stored password via the hasher
                        if (securityHasher.Confirm(user.password, readerLogin.GetString("PASSWORD")))
                        {
                            // Successful status
                            status = 1;

                            UserModel model = new UserModel(
                                readerLogin.GetInt32("ID"),
                                readerLogin.GetString("FIRST_NAME"),
                                readerLogin.GetString("LAST_NAME"),
                                readerLogin.GetString("EMAIL"),
                                readerLogin.GetString("USERNAME"),
                                readerLogin.GetString("PASSWORD"));
                        }
                        else
                        {
                            // Incorrect password status
                            status = -1;
                            connection.Close();
                            return status;
                        }
                    }
                    else
                    {
                        // Incorrect username status
                        status = -2;
                        connection.Close();
                        return status;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }

                connection.Close();
            }

            return status;
        }

        // Register function for users
        public int Register(UserModel user)
        {
            int status = 0;

            string sqlStatement = "INSERT INTO fireboxgo.accounts (FIRST_NAME, LAST_NAME, EMAIL, USERNAME, PASSWORD) SELECT @FIRST_NAME, @LAST_NAME, @EMAIL, @USERNAME, @PASSWORD WHERE NOT EXISTS (SELECT 1 FROM fireboxgo.accounts WHERE USERNAME = @USERNAME OR EMAIL = @EMAIL);";

            string sqlUsernameCheck = "SELECT COUNT(*) FROM fireboxgo.accounts WHERE USERNAME = @USERNAME;";

            string sqlEmailCheck = "SELECT COUNT(*) FROM fireboxgo.accounts WHERE EMAIL = @EMAIL;";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Perform function and add parameters
                    MySqlCommand commandInsert = new MySqlCommand(sqlStatement, connection);
                    commandInsert.Parameters.AddWithValue("@FIRST_NAME", user.firstName);
                    commandInsert.Parameters.AddWithValue("@LAST_NAME", user.lastName);
                    commandInsert.Parameters.AddWithValue("@EMAIL", user.email);
                    commandInsert.Parameters.AddWithValue("@USERNAME", user.username);
                    commandInsert.Parameters.AddWithValue("@PASSWORD", user.password);
                    var result = commandInsert.ExecuteNonQuery();

                    if (result > 0)
                    {
                        // Successful status
                        status = 1;
                        connection.Close();
                        return status;
                    }
                    else
                    {
                        // Check for username already in use
                        MySqlCommand commandUsernameCheck = new MySqlCommand(sqlUsernameCheck, connection);
                        commandUsernameCheck.Parameters.AddWithValue("@USERNAME", user.username);
                        long checkUsername = (long)commandUsernameCheck.ExecuteScalar();

                        // Check for email already in use
                        MySqlCommand commandEmailCheck = new MySqlCommand(sqlEmailCheck, connection);
                        commandEmailCheck.Parameters.AddWithValue("@EMAIL", user.email);
                        long checkEmail = (long)commandEmailCheck.ExecuteScalar();

                        if(checkUsername > 0 && checkEmail > 0)
                        {
                            // Both in use status
                            status = -3;
                            connection.Close();
                            return status;
                        }
                        else if(checkEmail > 0)
                        {
                            // Email in use status
                            status = -2;
                            connection.Close();
                            return status;
                        }
                        else if (checkUsername > 0)
                        {
                            // Username in use status
                            status = -1;
                            connection.Close();
                            return status;
                        }
                    }

                    connection.Close();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }

                return status;
            }
        }

        // Get a logged in user's id
        public int GetUserID(UserModel user)
        {
            string sqlStatement = "SELECT ID FROM fireboxgo.accounts WHERE USERNAME = @USERNAME";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                // Peform function and add parameters
                MySqlCommand command = new MySqlCommand(sqlStatement, connection);
                command.Parameters.AddWithValue("@USERNAME", user.username);

                try
                {
                    connection.Open();
                    MySqlDataReader reader = command.ExecuteReader();

                    if (reader.HasRows)
                    {
                        reader.Read();
                        return reader.GetInt32(0);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }

            return 0;
        }

        // Read function for account info
        public UserModel GetAccountInfo(int userID)
        {
            UserModel user = new UserModel();

            string sqlStatement = "SELECT * FROM fireboxgo.accounts WHERE ID = @ID";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Perform function and add parameters
                    MySqlCommand command = new MySqlCommand(sqlStatement, connection);
                    command.Parameters.AddWithValue("@ID", userID);
                    MySqlDataReader reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            user.ID = reader.GetInt32(0);
                            user.firstName = reader.GetString(1);
                            user.lastName = reader.GetString(2);
                            user.email = reader.GetString(3);
                            user.username = reader.GetString(4);
                            user.password = "";
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
            return user;
        }

        // Read function for household info totals
        public List<decimal> GetHouseholdTotals(int userID)
        {
            List<decimal> totals = new List<decimal>();

            string sqlStatement = "SELECT (SELECT SUM(items.PURCHASE_PRICE) FROM fireboxgo.items WHERE accounts_ID = @accounts_ID) AS total_purchase_price, (SELECT SUM(items.RETAIL_PRICE) FROM fireboxgo.items WHERE @accounts_ID) AS total_retail_price, (SELECT COUNT(*) FROM rooms WHERE accounts_ID = @accounts_ID) AS total_rooms, (SELECT COUNT(*) FROM items WHERE accounts_ID = @accounts_ID) AS total_items";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Perform function and add parameters
                    MySqlCommand command = new MySqlCommand(sqlStatement, connection);
                    command.Parameters.AddWithValue("@accounts_ID", userID);
                    MySqlDataReader reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            totals.Add(reader.GetDecimal(0));
                            totals.Add(reader.GetDecimal(1));
                            totals.Add(reader.GetDecimal(2));
                            totals.Add(reader.GetDecimal(3));
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
            return totals;
        }

        // Read function for all name search results
        public List<object> NameSearchAll(string search, int userID)
        {
            List<object> results = new List<object>();
            DocModel newDoc = new DocModel();
            FolderModel newFolder = new FolderModel();
            ItemModel newItem = new ItemModel();

            string sqlStatement = "SELECT 'File' AS source, ID AS ID, FILE_NAME AS Name, FILE AS File, NULL AS Date, NULL AS Purchase, NULL AS Retail, NULL AS Description, NULL AS Age, NULL AS Image, NULL AS RoomID, NULL AS Tags FROM fireboxgo.files WHERE LOWER(FILE_NAME) LIKE LOWER(CONCAT('%', @search, '%')) AND accounts_ID = @accounts_ID UNION ALL SELECT 'Room' AS source, rooms.ID AS ID, rooms.ROOM_NAME AS Name, NULL AS File, NULL AS Date, NULL AS Purchase, NULL AS Retail, rooms.DESCRIPTION AS Description, NULL AS Age, NULL AS Image, NULL AS RoomID, GROUP_CONCAT(tags.TAG_NAME ORDER BY tags.TAG_NAME SEPARATOR ', ') AS Tags FROM fireboxgo.rooms LEFT JOIN fireboxgo.room_taggings ON rooms.ID = room_taggings.rooms_ID LEFT JOIN fireboxgo.tags ON room_taggings.tags_ID = tags.ID WHERE LOWER(rooms.ROOM_NAME) LIKE LOWER(CONCAT('%', @search, '%')) AND rooms.accounts_ID = @accounts_ID GROUP BY rooms.ID, rooms.ROOM_NAME, rooms.DESCRIPTION UNION ALL SELECT 'Item' AS source, items.ID AS ID, items.ITEM_NAME AS Name, NULL AS File, items.PURCHASE_DATE AS Date, items.PURCHASE_PRICE AS Purchase, items.RETAIL_PRICE AS Retail, items.DESCRIPTION AS Description, items.OWNERSHIP_AGE AS Age, items.IMAGE AS Image, items.rooms_ID AS RoomID, GROUP_CONCAT(tags.TAG_NAME ORDER BY tags.TAG_NAME SEPARATOR ', ') AS Tags FROM fireboxgo.items LEFT JOIN fireboxgo.item_taggings ON items.ID = item_taggings.items_ID LEFT JOIN fireboxgo.tags ON item_taggings.tags_ID = tags.ID WHERE LOWER(items.ITEM_NAME) LIKE LOWER(CONCAT('%', @search, '%')) AND items.accounts_ID = @accounts_ID GROUP BY items.ID, items.ITEM_NAME, items.PURCHASE_DATE, items.PURCHASE_PRICE, items.RETAIL_PRICE, items.DESCRIPTION, items.OWNERSHIP_AGE, items.IMAGE, items.rooms_ID ORDER BY Name ASC";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Perform function and add parameters
                    MySqlCommand command = new MySqlCommand(sqlStatement, connection);
                    command.Parameters.AddWithValue("@search", search);
                    command.Parameters.AddWithValue("@accounts_ID", userID);
                    MySqlDataReader reader = command.ExecuteReader();

                    if (reader.HasRows) 
                    { 
                        while(reader.Read())
                        {
                            // Check if current result is a file type
                            if (reader.GetString(0) == "File")
                            {
                                byte[] fileData = new byte[0];
                                string docImage = "";

                                if (!reader.IsDBNull(3))
                                {
                                    // Handle the image bytes
                                    long byteCount = reader.GetBytes(3, 0, null, 0, 0);
                                    if (byteCount > 0)
                                    {
                                        fileData = new byte[byteCount];
                                        reader.GetBytes(3, 0, fileData, 0, (int)byteCount);
                                        docImage = Convert.ToBase64String(fileData);
                                    }
                                    else
                                    {
                                        fileData = new byte[0];
                                    }
                                }

                                // Add file to results
                                results.Add(
                                    newDoc = new DocModel(
                                        reader.GetInt32(1), 
                                        reader.GetString(2), 
                                        docImage, 
                                        userID
                                    )
                                );
                            }

                            // Check if current result is a room type
                            else if (reader.GetString(0) == "Room")
                            {
                                
                                List<string> tags = new List<string>();
                                string tagsString = reader.IsDBNull(11) ? string.Empty : reader.GetString(11);

                                // Get the tags and store them in a list for the folder model
                                string[] tagsArray = tagsString.Split(',');
                                foreach (var tag in tagsArray)
                                {
                                    string trimmedTag = tag.Trim();
                                    if (!string.IsNullOrEmpty(trimmedTag))
                                    {
                                        tags.Add(trimmedTag);
                                    }
                                }

                                // Add room to results
                                results.Add(
                                    newFolder = new FolderModel(
                                        reader.GetInt32(1),
                                        reader.GetString(2),
                                        reader.GetString(7),
                                        tags,
                                        userID
                                    )
                                );
                            }

                            // Check if current result is an item type
                            else if (reader.GetString(0) == "Item")
                            {
                                List<string> tags = new List<string>();
                                byte[] itemData = new byte[0];
                                string itemImage = "";
                                string tagsString = reader.IsDBNull(11) ? string.Empty : reader.GetString(11);

                                if (!reader.IsDBNull(8))
                                {
                                    // Handle the image bytes
                                    long byteCount = reader.GetBytes(9, 0, null, 0, 0);
                                    if (byteCount > 0)
                                    {
                                        itemData = new byte[byteCount];
                                        reader.GetBytes(9, 0, itemData, 0, (int)byteCount);
                                        itemImage = Convert.ToBase64String(itemData);
                                    }
                                    else
                                    {
                                        itemData = new byte[0];
                                    }
                                }

                                // Get the tags and store them in a list for the folder model
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
                                results.Add(
                                    newItem = new ItemModel(
                                        reader.GetInt32(1),
                                        reader.GetString(2),
                                        DateOnly.FromDateTime(reader.GetDateTime(4)),
                                        reader.GetDecimal(5),
                                        reader.GetDecimal(6),
                                        reader.GetString(7),
                                        reader.GetInt32(8),
                                        tags,
                                        itemImage,
                                        reader.GetInt32(10),
                                        userID
                                    )
                                );
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
            return results;
        }

        // Read function for all name search results
        public List<object> TagSearchAll(string search, int userID)
        {
            List<object> results = new List<object>();
            FolderModel newFolder = new FolderModel();
            ItemModel newItem = new ItemModel();

            string sqlStatement = "SELECT 'Room' AS source, rooms.ID AS ID, rooms.ROOM_NAME AS Name, NULL AS Date, NULL AS Purchase, NULL AS Retail, rooms.DESCRIPTION AS Description, NULL AS Age, NULL AS Image, NULL AS RoomID, GROUP_CONCAT(tags.TAG_NAME ORDER BY tags.TAG_NAME SEPARATOR ', ') AS Tags FROM fireboxgo.rooms LEFT JOIN fireboxgo.room_taggings ON rooms.ID = room_taggings.rooms_ID LEFT JOIN fireboxgo.tags ON room_taggings.tags_ID = tags.ID WHERE rooms.accounts_ID = @accounts_ID AND rooms.ID IN (SELECT room_taggings.rooms_ID FROM fireboxgo.room_taggings LEFT JOIN fireboxgo.tags ON room_taggings.tags_ID = tags.ID WHERE LOWER(tags.TAG_NAME) LIKE LOWER(CONCAT('%', @search, '%'))) GROUP BY rooms.ID, rooms.ROOM_NAME, rooms.DESCRIPTION UNION ALL SELECT 'Item' AS source, items.ID AS ID, items.ITEM_NAME AS Name, items.PURCHASE_DATE AS Date, items.PURCHASE_PRICE AS Purchase, items.RETAIL_PRICE AS Retail, items.DESCRIPTION AS Description, items.OWNERSHIP_AGE AS Age, items.IMAGE AS Image, items.rooms_ID AS RoomID, GROUP_CONCAT(tags.TAG_NAME ORDER BY tags.TAG_NAME SEPARATOR ', ') AS Tags FROM fireboxgo.items LEFT JOIN fireboxgo.item_taggings ON items.ID = item_taggings.items_ID LEFT JOIN fireboxgo.tags ON item_taggings.tags_ID = tags.ID WHERE items.accounts_ID = @accounts_ID AND items.ID IN (SELECT item_taggings.items_ID FROM fireboxgo.item_taggings LEFT JOIN fireboxgo.tags ON item_taggings.tags_ID = tags.ID WHERE LOWER(tags.TAG_NAME) LIKE LOWER(CONCAT('%', @search, '%'))) GROUP BY items.ID, items.ITEM_NAME, items.PURCHASE_DATE, items.PURCHASE_PRICE, items.RETAIL_PRICE, items.DESCRIPTION, items.OWNERSHIP_AGE, items.IMAGE, items.rooms_ID";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Perform function and add parameters
                    MySqlCommand command = new MySqlCommand(sqlStatement, connection);
                    command.Parameters.AddWithValue("@search", search);
                    command.Parameters.AddWithValue("@accounts_ID", userID);
                    MySqlDataReader reader = command.ExecuteReader();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            // Check if current result is a room type
                            if (reader.GetString(0) == "Room")
                            {

                                List<string> tags = new List<string>();
                                string tagsString = reader.IsDBNull(10) ? string.Empty : reader.GetString(10);

                                // Get the tags and store them in a list for the folder model
                                string[] tagsArray = tagsString.Split(',');
                                foreach (var tag in tagsArray)
                                {
                                    string trimmedTag = tag.Trim();
                                    if (!string.IsNullOrEmpty(trimmedTag))
                                    {
                                        tags.Add(trimmedTag);
                                    }
                                }

                                // Add room to results
                                results.Add(
                                    newFolder = new FolderModel(
                                        reader.GetInt32(1),
                                        reader.GetString(2),
                                        reader.GetString(6),
                                        tags,
                                        userID
                                    )
                                );
                            }

                            // Check if current result is an item type
                            else if (reader.GetString(0) == "Item")
                            {
                                List<string> tags = new List<string>();
                                byte[] itemData = new byte[0];
                                string itemImage = "";
                                string tagsString = reader.IsDBNull(10) ? string.Empty : reader.GetString(10);

                                if (!reader.IsDBNull(8))
                                {
                                    // Handle the image bytes
                                    long byteCount = reader.GetBytes(8, 0, null, 0, 0);
                                    if (byteCount > 0)
                                    {
                                        itemData = new byte[byteCount];
                                        reader.GetBytes(8, 0, itemData, 0, (int)byteCount);
                                        itemImage = Convert.ToBase64String(itemData);
                                    }
                                    else
                                    {
                                        itemData = new byte[0];
                                    }
                                }

                                // Get the tags and store them in a list for the folder model
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
                                results.Add(
                                    newItem = new ItemModel(
                                        reader.GetInt32(1),
                                        reader.GetString(2),
                                        DateOnly.FromDateTime(reader.GetDateTime(3)),
                                        reader.GetDecimal(4),
                                        reader.GetDecimal(5),
                                        reader.GetString(6),
                                        reader.GetInt32(7),
                                        tags,
                                        itemImage,
                                        reader.GetInt32(9),
                                        userID
                                    )
                                );
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
            return results;
        }
    }
}
