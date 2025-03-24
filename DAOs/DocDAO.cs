using FireboxGo.Models;
using MySql.Data.MySqlClient;
using Org.BouncyCastle.Utilities;

namespace FireboxGo.DAOs
{
    public class DocDAO
    {
        private string connectionString = "Server=localhost;port=3306;UserID=root;Password=root;Database=fireboxgo";

        // Read function for folders
        public List<DocModel> GetFiles(int userID)
        {
            List<DocModel> files = new List<DocModel>();
            DocModel newDoc = new DocModel();

            string sqlStatement = "SELECT * FROM fireboxgo.files WHERE accounts_ID = @accounts_ID ORDER BY FILE_NAME ASC";

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
                            byte[] fileData = new byte[0];
                            string docImage = "";

                            if (!reader.IsDBNull(2))
                            {
                                // Handle the image bytes
                                long byteCount = reader.GetBytes(2, 0, null, 0, 0);
                                if (byteCount > 0)
                                {
                                    fileData = new byte[byteCount];
                                    reader.GetBytes(2, 0, fileData, 0, (int)byteCount);
                                    docImage = Convert.ToBase64String(fileData);
                                }
                                else
                                {
                                    fileData = new byte[0];
                                }
                            }

                            // Add file to results
                            files.Add(
                                newDoc = new DocModel(
                                    reader.GetInt32(0),
                                    reader.GetString(1),
                                    docImage,
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
            return files;
        }

        // Upload function for a file
        public bool UploadFile(DocModel newDoc, int userID)
        {
            bool status = false;
            byte[] imageBytes = Convert.FromBase64String(newDoc.docImage);

            string sqlPacketStatement = "SET GLOBAL max_allowed_packet = 1073741824;";

            string sqlInsertStatement = "INSERT INTO fireboxgo.files (FILE_NAME, FILE, accounts_ID) VALUES (@FILE_NAME, @FILE, @accounts_ID)";

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
                    commandInsert.Parameters.AddWithValue("@FILE_NAME", newDoc.docName);
                    commandInsert.Parameters.AddWithValue("@FILE", imageBytes);
                    commandInsert.Parameters.AddWithValue("@accounts_ID", userID);
                    commandInsert.ExecuteNonQuery();

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

        // Delete function for files
        public bool DeleteFile(int docID)
        {
            bool status = false;

            string sqlStatement = "DELETE FROM fireboxgo.files WHERE ID = @ID";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Perform function and add parameters
                    MySqlCommand commandTagging = new MySqlCommand(sqlStatement, connection);
                    commandTagging.Parameters.AddWithValue("@ID", docID);
                    commandTagging.ExecuteNonQuery();

                    status = true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }

            return status;
        }
    }
}
