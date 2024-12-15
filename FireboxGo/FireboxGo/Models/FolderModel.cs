namespace FireboxGo.Models
{
    public class FolderModel
    {
        private int id { get; set; }

        private string folderName { get; set; }

        private string description { get; set; }

        private List<string> folderTags { get; set; }

        private int userId { get; set; }

        public FolderModel()
        {
            id = 0;
            folderName = "";
            description = "";
            folderTags = new List<string>();
            userId = 0;
        }

        public FolderModel(int id, string folderName, string description, List<string> folderTags, int userId)
        {
            this.id = id;
            this.folderName = folderName;
            this.description = description;
            this.folderTags = folderTags;
            this.userId = userId;
        }
    }
}
