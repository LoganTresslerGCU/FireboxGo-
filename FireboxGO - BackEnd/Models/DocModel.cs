namespace FireboxGo.Models
{
    public class DocModel
    {
        public int ID {  get; set; }

        public string docName { get; set; }

        public string docImage { get; set; }

        public int userID { get; set; }

        public DocModel()
        {
            ID = 0;
            docName = "";
            docImage = "";
            userID = 0;
        }

        public DocModel(int ID, string docName, string docImage, int userID)
        {
            this.ID = ID;
            this.docName = docName;
            this.docImage = docImage;
            this.userID = userID;
        }
    }
}
