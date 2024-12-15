namespace FireboxGo.Models
{
    public class UserModel
    {
        public int ID { get; set; }

        public string firstName { get; set; }

        public string lastName { get; set; }

        public string email { get; set; }

        public string username { get; set; }

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
