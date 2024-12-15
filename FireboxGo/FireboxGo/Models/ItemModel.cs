﻿namespace FireboxGo.Models
{
    public class ItemModel
    {
        public int ID {  get; set; }

        public string itemName { get; set; }

        public DateOnly purchaseDate { get; set; }

        public decimal purchasePrice { get; set;}

        public decimal retailPrice { get; set;}

        public string description { get; set; }

        public int ownershipAge { get; set; }

        public List<String> tags { get; set; }

        public Byte[] itemImage {  get; set; }

        public int userID { get; set; }

        public int folderID { get; set; }

        public ItemModel()
        {
            ID = 0;
            itemName = "";
            purchaseDate = new DateOnly();
            purchasePrice = new decimal();
            retailPrice = new decimal();
            description = "";
            ownershipAge = 0;
            tags = new List<String>();
            itemImage = new Byte[0];
            userID = 0;
            folderID = 0;
        }

        public ItemModel(int ID, string itemName, DateOnly purchaseDate, decimal purchasePrice, decimal retailPrice, string description, int ownershipAge, List<String> tags, byte[] itemImage, int userID, int folderID)
        {
            this.ID = ID;
            this.itemName = itemName;
            this.purchaseDate = purchaseDate;
            this.purchasePrice = purchasePrice;
            this.retailPrice = retailPrice;
            this.description = description;
            this.ownershipAge = ownershipAge;
            this.tags = tags;
            this.itemImage = itemImage;
            this.userID = userID;
            this.folderID = folderID;
        }
    }
}