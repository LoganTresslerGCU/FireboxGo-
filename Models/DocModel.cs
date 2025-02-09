namespace FireboxGo.Models
{
    public class DocModel
    {
        public int ID {  get; private set; }

        public string docName { get; private set; }

        public Byte[] docImage { get; private set; }

        public int userID { get; private set; }

        public DocModel()
        {
            ID = 0;
            docName = "";
            docImage = new Byte[0];
            userID = 0;
        }

        public DocModel(int ID, string docName, byte[] docImage, int userID)
        {
            this.ID = ID;
            this.docName = docName;
            this.docImage = docImage;
            this.userID = userID;
        }
    }
}
