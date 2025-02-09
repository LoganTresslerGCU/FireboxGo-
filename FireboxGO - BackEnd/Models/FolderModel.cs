namespace FireboxGo.Models
{
    public class FolderModel
    {
        public int ID { get; set; }

        public string folderName { get; set; }

        public string description { get; set; }

        public List<string> folderTags { get; set; }

        public int userID { get; set; }

        public FolderModel()
        {
            ID = 0;
            folderName = "";
            description = "";
            folderTags = new List<string>();
            userID = 0;
        }

        public FolderModel(int ID, string folderName, string description, List<string> folderTags, int userID)
        {
            this.ID = ID;
            this.folderName = folderName;
            this.description = description;
            this.folderTags = folderTags;
            this.userID = userID;
        }
    }
}
