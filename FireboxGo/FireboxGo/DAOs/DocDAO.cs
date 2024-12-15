using FireboxGo.Models;
using MySql.Data.MySqlClient;
using Org.BouncyCastle.Utilities;

namespace FireboxGo.DAOs
{
    public class DocDAO
    {
        private string connectionString = "Server=localhost;port=3306;UserID=root;Password=root;Database=fireboxgo";

        public List<DocModel> GetDocs(int userID)
        {
            List<DocModel> docs = new List<DocModel>();
            string sqlStatement = "SELECT * FROM docs WHERE user_ID = @user_ID";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                MySqlCommand command = new MySqlCommand(sqlStatement, connection);
                command.Parameters.AddWithValue("@user_ID", userID);

                try
                {
                    connection.Open();
                    MySqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        if (!reader.IsDBNull(0) && !reader.IsDBNull(1) && !reader.IsDBNull(2))
                        {
                            docs.Add(new DocModel((int)reader[0], (string)reader[1], (Byte[])reader[2], (int)reader[3]));
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }

                return docs;
            }
        }

        public bool SearchDocs(DocModel doc)
        {
            return false;
        }

        public bool CreateDoc(DocModel doc)
        {
            bool status = false;
            string sqlStatement = "INSERT INTO fireboxgo.docs (DOC_NAME, DOC_IMAGE, user_ID) VALUES (@DOC_NAME, @DOC_IMAGE, @user_ID)";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                MySqlCommand command = new MySqlCommand(sqlStatement, connection);
                command.Parameters.AddWithValue("@DOC_NAME", doc.docName);
                command.Parameters.AddWithValue("@DOC_IMAGE", doc.docImage);
                command.Parameters.AddWithValue("@user_ID", doc.userID);

                try
                {
                    connection.Open();
                    var result = command.ExecuteNonQuery();
                    if (result > 0)
                    {
                        status = true;
                        return status;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }

                return status;
            }
        }

        public bool DeleteDoc(DocModel doc)
        {
            return false;
        }
    }
}
