using FireboxGo.Models;
using FireboxGo.Security;
using MySql.Data.MySqlClient;
using System.Reflection.PortableExecutable;

namespace FireboxGo.DAOs
{
    public class FolderDAO
    {
        private string connectionString = "Server=localhost;port=3306;UserID=root;Password=root;Database=fireboxgo";

        // Read function for folders
        public List<FolderModel> GetFolders(int userID)
        {
            List<FolderModel> folders = new List<FolderModel>();
            Dictionary<int, FolderModel> folderDictionary = new Dictionary<int, FolderModel>();

            string sqlStatement = "SELECT fireboxgo.rooms.ID, fireboxgo.rooms.ROOM_NAME, fireboxgo.rooms.DESCRIPTION, fireboxgo.tags.TAG_NAME FROM fireboxgo.rooms LEFT JOIN fireboxgo.room_taggings ON fireboxgo.rooms.ID = fireboxgo.room_taggings.rooms_ID LEFT JOIN fireboxgo.tags ON fireboxgo.room_taggings.tags_ID = fireboxgo.tags.ID WHERE fireboxgo.rooms.accounts_ID = @accounts_ID";

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
                            int folderID = reader.GetInt32("ID");
                            string folderName = reader.GetString("ROOM_NAME");
                            string description = reader.GetString("DESCRIPTION");
                            string tagName = reader.IsDBNull(reader.GetOrdinal("TAG_NAME")) ? null : reader.GetString("TAG_NAME");

                            // Tie retrieved tags to their given folder by folderID
                            if (!folderDictionary.ContainsKey(folderID))
                            {
                                folderDictionary[folderID] = new FolderModel
                                {
                                    ID = folderID,
                                    folderName = folderName,
                                    description = description,
                                    folderTags = new List<string>(),
                                    userID = userID
                                };
                            }

                            if (tagName != null)
                            {
                                folderDictionary[folderID].folderTags.Add(tagName);
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
            folders.AddRange(folderDictionary.Values);
            return folders;
        }

        // Create function for folders
        public bool CreateFolder(FolderModel folder, int userID)
        {
            bool status = false;
            List<int> tagIDs = new List<int>();
            long newFolderID = 0;

            string sqlInsertStatement = "INSERT INTO fireboxgo.rooms (ROOM_NAME, DESCRIPTION, accounts_ID) VALUES (@ROOM_NAME, @DESCRIPTION, @accounts_ID)";

            string sqlTagStatement = "SELECT ID FROM fireboxgo.tags WHERE TAG_NAME = @TAG_NAME";

            string sqlTaggingsStatement = "INSERT INTO fireboxgo.room_taggings (rooms_ID, tags_ID, accounts_ID) VALUES (@rooms_ID, @tags_ID, @accounts_ID)";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Perform function and add parameters for the folders table
                    MySqlCommand commandInsert = new MySqlCommand(sqlInsertStatement, connection);
                    commandInsert.Parameters.AddWithValue("@ROOM_NAME", folder.folderName);
                    commandInsert.Parameters.AddWithValue("@DESCRIPTION", folder.description);
                    commandInsert.Parameters.AddWithValue("@accounts_ID", userID);
                    commandInsert.ExecuteNonQuery();

                    newFolderID = commandInsert.LastInsertedId;

                    // Get tag IDs
                    for (int i = 0; i < folder.folderTags.Count(); i++)
                    {
                        MySqlCommand commandTag = new MySqlCommand(sqlTagStatement, connection);
                        commandTag.Parameters.AddWithValue("@TAG_NAME", folder.folderTags[i]);
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
                        commandTagging.Parameters.AddWithValue("@rooms_ID", newFolderID);
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

        // Update function for folders
        public bool UpdateFolder(FolderModel folder, int userID, int folderID)
        {
            bool status = false;
            List<int> currentTags = new List<int>();
            List<int> newTags = new List<int>();
            List<int> tagsToRemove = new List<int>();
            List<int> tagsToAdd = new List<int>();

            string sqlUpdateStatement = "UPDATE fireboxgo.rooms SET ROOM_NAME = @ROOM_NAME, DESCRIPTION = @DESCRIPTION WHERE ID = @ID";

            string sqlTagStatement = "SELECT ID FROM fireboxgo.tags WHERE TAG_NAME = @TAG_NAME";

            string sqlTaggingStatement = "SELECT tags_ID FROM fireboxgo.room_taggings WHERE rooms_ID = @rooms_ID";

            string sqlDeleteStatement = "DELETE FROM fireboxgo.room_taggings WHERE rooms_ID = @rooms_ID AND tags_ID = @tags_ID";

            string sqlInsertStatement = "INSERT INTO fireboxgo.room_taggings (rooms_ID, tags_ID, accounts_ID) VALUES (@rooms_ID, @tags_ID, @accounts_ID)";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Perform function and add parameters for the folders table
                    MySqlCommand commandUpdate = new MySqlCommand(sqlUpdateStatement, connection);
                    commandUpdate.Parameters.AddWithValue("@ROOM_NAME", folder.folderName);
                    commandUpdate.Parameters.AddWithValue("@DESCRIPTION", folder.description);
                    commandUpdate.Parameters.AddWithValue("@ID", folderID);
                    commandUpdate.ExecuteNonQuery();

                    for (int i = 0; i < folder.folderTags.Count(); i++)
                    {
                        // Get tag IDs
                        MySqlCommand commandTag = new MySqlCommand(sqlTagStatement, connection);
                        commandTag.Parameters.AddWithValue("@TAG_NAME", folder.folderTags[i]);
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
                    commandTagging.Parameters.AddWithValue("@rooms_ID", folderID);
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
                        for(int i = 0; i < tagsToRemove.Count; i++)
                        {
                            // Delete tags no longer assigned to the folder
                            MySqlCommand commandRemove = new MySqlCommand(sqlDeleteStatement, connection);
                            commandRemove.Parameters.AddWithValue("@rooms_ID", folderID);
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
                            // Add tags now assigned to the folder
                            MySqlCommand commandAdd = new MySqlCommand(sqlInsertStatement, connection);
                            commandAdd.Parameters.AddWithValue("@rooms_ID", folderID);
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

        // Delete function for folders
        public bool DeleteFolder(int folderID)
        {
            bool status = false;

            string sqlChildStatement = "DELETE FROM fireboxgo.room_taggings WHERE rooms_ID = @rooms_ID";

            string sqlParentStatement = "DELETE FROM fireboxgo.rooms WHERE ID = @ID";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Perform function and add parameters for the taggings table first
                    MySqlCommand commandTagging = new MySqlCommand(sqlChildStatement, connection);
                    commandTagging.Parameters.AddWithValue("@rooms_ID", folderID);
                    commandTagging.ExecuteNonQuery();

                    // Perform function and add parameters for the folders table next
                    MySqlCommand commandFolder = new MySqlCommand(sqlParentStatement, connection);
                    commandFolder.Parameters.AddWithValue("@ID", folderID);
                    commandFolder.ExecuteNonQuery();

                    status = true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }

            return status;
        }

        // Read function for tags
        public List<string> GetTags()
        {
            List<string> tags = new List<string>();

            string sqlStatement = "SELECT fireboxgo.tags.TAG_NAME FROM fireboxgo.tags";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    
                    // Perform function and add parameters
                    MySqlCommand command = new MySqlCommand(sqlStatement, connection);
                    MySqlDataReader reader = command.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            tags.Add(reader.GetString(0));
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
            return tags;
        }
    }
}