using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace FireboxGo.Models
{
    public class UserModel
    {
        public int ID { get; set; }

        public string firstName { get; set; }

        public string lastName { get; set; }

        public string email { get; set; }

        [Required(ErrorMessage = "Username is required.")]
        [StringLength(20, MinimumLength = 5, ErrorMessage = "Username must be between 5 and 20 characters.")]
        public string username { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(50, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters.")]
        public string password { get; set; }

        public UserModel()
        {
            ID = 0;
            firstName = "";
            lastName = "";
            email = "";
            username = "";
            password = "";
        }

        public UserModel(int ID, string firstName, string lastName, string email, string username, string password)
        {
            this.ID = ID;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.username = username;
            this.password = password;
        }
    }
}
