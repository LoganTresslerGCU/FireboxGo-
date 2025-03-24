using BCrypt.Net;

namespace FireboxGo.Security
{
    public class SecurityHasher
    {
        // BCrypt function that hashes a new password
        public string Store(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // BCrypt function that compares an inputted password to the stored hashed password
        public bool Confirm(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}