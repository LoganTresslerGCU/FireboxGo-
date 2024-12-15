using FireboxGo.Models;
using MySql.Data.MySqlClient;

namespace FireboxGo.DAOs
{
    public class UserDAO
    {
        private string connectionString = "Server=localhost;port=3306;UserID=root;Password=root;Database=fireboxgo";

        public bool Login(UserModel user)
        {
            bool status = false;
            string sqlStatement = "SELECT * FROM fireboxgo.accounts WHERE USERNAME = @USERNAME and PASSWORD = @PASSWORD";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                MySqlCommand command = new MySqlCommand(sqlStatement, connection);
                command.Parameters.AddWithValue("@USERNAME", user.username);
                command.Parameters.AddWithValue("@PASSWORD", user.password);

                try
                {
                    connection.Open();
                    MySqlDataReader reader = command.ExecuteReader();

                    if (reader.HasRows)
                    {
                        reader.Read();
                        status = true;

                        if (status)
                        {
                            UserModel model = new UserModel(
                                reader.GetInt32("ID"),
                                reader.GetString("FIRST_NAME"),
                                reader.GetString("LAST_NAME"),
                                reader.GetString("EMAIL"),
                                reader.GetString("USERNAME"), 
                                reader.GetString("PASSWORD"));
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }

            return status;
        }

        public bool Register(UserModel user)
        {
            bool status = false;
            string sqlStatement = "INSERT INTO fireboxgo.accounts (FIRST_NAME, LAST_NAME, EMAIL, USERNAME, PASSWORD) VALUES (@FIRST_NAME, @LAST_NAME, @EMAIL, @USERNAME, @PASSWORD)";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                MySqlCommand command = new MySqlCommand(sqlStatement, connection);
                command.Parameters.AddWithValue("@FIRST_NAME", user.firstName);
                command.Parameters.AddWithValue("@LAST_NAME", user.lastName);
                command.Parameters.AddWithValue("@EMAIL", user.email);
                command.Parameters.AddWithValue("@USERNAME", user.username);
                command.Parameters.AddWithValue("@PASSWORD", user.password);

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
    }
}
