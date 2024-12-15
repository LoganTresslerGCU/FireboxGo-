using FireboxGo.Models;
using MySql.Data.MySqlClient;
using Mysqlx.Crud;

namespace FireboxGo.DAOs
{
    public class ItemDAO
    {
        private string connectionString = "Server=localhost;port=3306;UserID=root;Password=root;Database=fireboxgo";

        public bool GetItems(ItemModel item)
        {
            return false;
        }

        public bool SearchItems(ItemModel item)
        {
            return false;
        }

        public bool CreateItem(ItemModel item)
        {
            bool status = false;

            string sqlStatementItem = "INSERT INTO fireboxgo.items (ITEM_NAME, PURCHASE_DATE, PURCHASE_PRICE, RETAIL_PRICE, DESCRIPTION, OWNERSHIP_AGE, ITEM_IMAGE, user_ID, folder_ID) VALUES (@ITEM_NAME, @PURCHASE_DATE, @PURCHASE_PRICE, @RETAIL_PRICE, @DESCRIPTION, @OWNERSHIP_AGE, @ITEM_IMAGE, @user_ID, @folder_ID)";

            string sqlStatementTag = "INSERT INTO fireboxgo.item_taggings (accounts_ID, items_ID, tags_ID) VALUES (@accounts_ID, @items_ID, @tags_ID)";

            using (MySqlConnection connection = new MySqlConnection(connectionString))
            {
                MySqlCommand commandItem = new MySqlCommand(sqlStatementItem, connection);
                commandItem.Parameters.AddWithValue("@ITEM_NAME", item.itemName);
                commandItem.Parameters.AddWithValue("@PURCHASE_DATE", item.purchaseDate);
                commandItem.Parameters.AddWithValue("@PURCHASE_PRICE", item.purchasePrice);
                commandItem.Parameters.AddWithValue("@RETAIL_PRICE", item.retailPrice);
                commandItem.Parameters.AddWithValue("@DESCRIPTION", item.description);
                commandItem.Parameters.AddWithValue("@OWNERSHIP_AGE", item.ownershipAge);
                commandItem.Parameters.AddWithValue("@ITEM_IMAGE", item.itemImage);

                List<MySqlCommand> commandTags = new List<MySqlCommand>();
                for (int i = 0; i < item.tags.Count; i++)
                {
                    MySqlCommand commandTag = new MySqlCommand(sqlStatementTag, connection);
                    commandTag.Parameters.AddWithValue("@account_ID", item.userID);
                    commandTag.Parameters.AddWithValue("@items_ID", item.ID);
                    commandTag.Parameters.AddWithValue("@tags_ID", item.tags[i]);
                    commandTags.Add(commandTag);
                }

                try
                {
                    connection.Open();
                    var resultItem = commandItem.ExecuteNonQuery();
                    int resultTags = 0;
                    for (int i = 0; i < commandTags.Count; i++)
                    {
                        resultTags = commandTags[i].ExecuteNonQuery();
                        if (resultTags == 0)
                        {
                            break;
                        }
                    }
                    if (resultItem > 0 && resultTags > 0)
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

        public bool UpdateItem(ItemModel item)
        {
            return false;
        }

        public bool DeleteItem(ItemModel item)
        {
            return false;
        }
    }
}
