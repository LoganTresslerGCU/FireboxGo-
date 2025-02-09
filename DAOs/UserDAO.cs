using FireboxGo.Models;
using FireboxGo.Security;
using MySql.Data.MySqlClient;

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
    }
}
