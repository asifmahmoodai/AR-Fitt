import "dotenv/config";
import process from "process";
import { buildPrismaClient } from "../../infra/db/prismaClient.js";

const prisma = buildPrismaClient();

export class PopulateData {
  async insertData() {
    if (!process.env.DATABASE_URL) {
      console.log("database URL is empty, not going to populate schema.");
      return;
    }

    await this.insertInventoryCategories();
    await this.insertInventoryDemoCategories();
    await this.insertInventoryItems();
    await this.insertInventoryDemoItems();
    await this.insertInventoryItemColors();
    await this.insertInventoryItemSizes();
    await this.insertInventoryItemImages();
    await this.insertInventoryItemImagesURL();
  }

  async insertInventoryCategories() {
    try {
      const result =
        await prisma.$executeRaw`SELECT * FROM public.inventory_category LIMIT 1;`;

      if (result == 1) {
        console.log("data already exists for inventory category table");
        return;
      }
    } catch (error) {
      console.log(
        "failed to query inventory category table to verify records existence, error: ",
        error
      );
      return;
    }

    try {
      await prisma.$transaction([
        prisma.$executeRaw`INSERT INTO public.inventory_category ("id", "name", "description", "type", "created_at", "modified_at") VALUES('8c8d034c-cf5e-45a4-9cef-ca95c0274f27', 'Shirts', NULL , 'apparel', '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_category ("id", "name", "description", "type", "created_at", "modified_at") VALUES('b98fd639-c6a7-46ee-971a-c7f484dcfde2', 'Pants', NULL, 'apparel', '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_category ("id", "name", "description", "type", "created_at", "modified_at") VALUES('1a34676c-f0f9-4349-911b-56d700220298', 'Shoes', NULL, 'apparel', '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_category ("id", "name", "description", "type", "created_at", "modified_at") VALUES('5b6c0533-d6bf-4437-8ea5-86814c7fbe37', 'Hats', NULL, 'apparel', '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_category ("id", "name", "description", "type", "created_at", "modified_at") VALUES('b8586e1b-09f6-490d-bf6a-3f18df089af7', 'Jackets', NULL, 'apparel', '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_category ("id", "name", "description", "type", "created_at", "modified_at") VALUES('df8b25af-0705-4288-b331-389d2db86096', 'Shorts', NULL, 'apparel', '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_category ("id", "name", "description", "type", "created_at", "modified_at") VALUES('ae53764d-58e1-42d5-958e-b616e9663473', 'T-Shirts', NULL , 'apparel', '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_category ("id", "name", "description", "type", "created_at", "modified_at") VALUES('e2b51511-e5ed-4936-96ff-6ce7987c147f', 'Dress Shirts', NULL , 'apparel', '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_category ("id", "name", "description", "type", "created_at", "modified_at") VALUES('d9feba45-a55e-476c-9e10-37fb140e6aaa', 'Under Shirts', NULL , 'apparel', '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_category ("id", "name", "description", "type", "created_at", "modified_at") VALUES('de724059-2c5d-444d-b43d-7f8672c077d2', 'Hoodies', NULL , 'apparel', '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_category ("id", "name", "description", "type", "created_at", "modified_at") VALUES('0da32a59-83aa-4b03-ad59-c0c38573f098', 'Casual Shirts', NULL , 'apparel', '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_category ("id", "name", "description", "type", "created_at", "modified_at") VALUES('6d475a28-4767-4a2c-a4b2-0ac36d61b737', 'Round-neck Shirts', NULL , 'apparel', '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_category ("id", "name", "description", "type", "created_at", "modified_at") VALUES('193aa98f-320c-4a7a-9923-a20b0e7ba8fe', 'Zipper Hoodies', NULL , 'apparel', '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_category ("id", "name", "description", "type", "created_at", "modified_at") VALUES('925ea5bc-04d1-47fb-b238-1b7a37ed0450', 'Warsaw Jackets', NULL , 'apparel', '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      ]);
      console.log("populated inventory categories data");
    } catch (error) {
      console.log(
        "failed to insert inventory categories data in database, error: ",
        error
      );
    }
  }

  async insertInventoryDemoCategories() {
    try {
      const result =
        await prisma.$executeRaw`SELECT * FROM public.inventory_demo_category LIMIT 1;`;

      if (result == 1) {
        console.log("data already exists for inventory demo category table");
        return;
      }
    } catch (error) {
      console.log(
        "failed to query inventory demo category table to verify records existence, error: ",
        error
      );
      return;
    }

    try {
      await prisma.$transaction([
        prisma.$executeRaw`INSERT INTO public.inventory_demo_category ("category_id", "is_demo_item", "created_at", "modified_at") VALUES('8c8d034c-cf5e-45a4-9cef-ca95c0274f27', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_category ("category_id", "is_demo_item", "created_at", "modified_at") VALUES('b98fd639-c6a7-46ee-971a-c7f484dcfde2', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_category ("category_id", "is_demo_item", "created_at", "modified_at") VALUES('1a34676c-f0f9-4349-911b-56d700220298', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_category ("category_id", "is_demo_item", "created_at", "modified_at") VALUES('5b6c0533-d6bf-4437-8ea5-86814c7fbe37', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_category ("category_id", "is_demo_item", "created_at", "modified_at") VALUES('b8586e1b-09f6-490d-bf6a-3f18df089af7', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_category ("category_id", "is_demo_item", "created_at", "modified_at") VALUES('df8b25af-0705-4288-b331-389d2db86096', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_category ("category_id", "is_demo_item", "created_at", "modified_at") VALUES('ae53764d-58e1-42d5-958e-b616e9663473', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_category ("category_id", "is_demo_item", "created_at", "modified_at") VALUES('e2b51511-e5ed-4936-96ff-6ce7987c147f', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_category ("category_id", "is_demo_item", "created_at", "modified_at") VALUES('d9feba45-a55e-476c-9e10-37fb140e6aaa', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_category ("category_id", "is_demo_item", "created_at", "modified_at") VALUES('de724059-2c5d-444d-b43d-7f8672c077d2', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_category ("category_id", "is_demo_item", "created_at", "modified_at") VALUES('0da32a59-83aa-4b03-ad59-c0c38573f098', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_category ("category_id", "is_demo_item", "created_at", "modified_at") VALUES('6d475a28-4767-4a2c-a4b2-0ac36d61b737', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_category ("category_id", "is_demo_item", "created_at", "modified_at") VALUES('193aa98f-320c-4a7a-9923-a20b0e7ba8fe', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_category ("category_id", "is_demo_item", "created_at", "modified_at") VALUES('925ea5bc-04d1-47fb-b238-1b7a37ed0450', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      ]);
      console.log("populated inventory demo categories data");
    } catch (error) {
      console.log(
        "failed to insert inventory demo categories data in database, error: ",
        error
      );
    }
  }

  async insertInventoryItems() {
    try {
      const result =
        await prisma.$executeRaw`SELECT * FROM public.inventory_item LIMIT 1;`;

      if (result == 1) {
        console.log("data already exists for inventory item table");
        return;
      }
    } catch (error) {
      console.log(
        "failed to query inventory item table to verify records existence, error: ",
        error
      );
      return;
    }

    try {
      await prisma.$transaction([
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('555e3f63-f927-4b76-93cd-098ee5fbde4e', '8c8d034c-cf5e-45a4-9cef-ca95c0274f27', 'Round-neck Shirt', 'Gucci', '12.05', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('280f0550-5ac4-4f55-8777-6b46db6e27a3', '8c8d034c-cf5e-45a4-9cef-ca95c0274f27', 'Flower Shirt', 'Versace', '10.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('aec77d9e-c1d0-4678-82b2-60c6f33531ae', '8c8d034c-cf5e-45a4-9cef-ca95c0274f27', 'V-neck Shirt', 'Gucci', '20.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('5fecd45a-016b-41b2-ae2c-4a74d878963d', '8c8d034c-cf5e-45a4-9cef-ca95c0274f27', 'Wild Shark Shirt', 'Bata', '5.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('55d70f75-c9b3-46a0-a2b5-09e9bfe9830a', '8c8d034c-cf5e-45a4-9cef-ca95c0274f27', 'Shinning Star Shirt', 'Levis', '3.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('2f97defc-964c-45b8-b8e4-5ce85892cd90', 'b98fd639-c6a7-46ee-971a-c7f484dcfde2', 'Blue Fainted Jeans', 'Gucci', '20.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('01cb9f7b-3aa7-46bd-8bc2-31e82eecbbfc', 'b98fd639-c6a7-46ee-971a-c7f484dcfde2', 'Black Jeans', 'Levis', '18.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('e0f4d691-c624-4b6b-9896-3c451141eda3', 'b98fd639-c6a7-46ee-971a-c7f484dcfde2', 'Dark Jeans', 'Mango', '8.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('b53942ae-fd6b-4da0-83d5-db0a1dadc1c4', 'b98fd639-c6a7-46ee-971a-c7f484dcfde2', 'Cotton Jeans', 'Mango', '5.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('d5e7f0e0-c6dd-4e50-b023-c18b4d5d5965', 'b98fd639-c6a7-46ee-971a-c7f484dcfde2', 'Cotton Pants', 'One', '25.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('e68e6704-906b-4ac6-8349-be4032fe899e', '1a34676c-f0f9-4349-911b-56d700220298', 'Kids Jeans Shoes', 'Gucci', '5.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('6349f90e-a401-4f51-b124-c392c8faf2a1', '1a34676c-f0f9-4349-911b-56d700220298', 'Black Heals', 'Starways', '50.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('387b06d7-b5a4-4d51-9c30-226908d870a3', '1a34676c-f0f9-4349-911b-56d700220298', 'Daily Goto Shoes', 'Bata', '15.55', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('64c88b4c-5d99-41bf-b523-cf92c61aa3d8', '1a34676c-f0f9-4349-911b-56d700220298', 'Daily Softy', 'Servis', '12.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('297e9cd4-73b1-4ad0-a8d8-8325c0de9a66', '1a34676c-f0f9-4349-911b-56d700220298', 'Dress Shoes', 'Nike', '35.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('3d056ef8-11fb-40f0-8eeb-ff8e0d685a4b', '5b6c0533-d6bf-4437-8ea5-86814c7fbe37', 'Picnic Hat', 'Stylo', '3.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('ea599675-6d31-4467-b5a9-7799fe528971', '5b6c0533-d6bf-4437-8ea5-86814c7fbe37', 'Kenzo Style', 'Stylo', '1.55', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('c940961e-f12e-476f-8076-a78634cf0d2b', '5b6c0533-d6bf-4437-8ea5-86814c7fbe37', 'Los Angelas Hat', 'Bata', '4.53', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('d62ede80-8792-43fb-9663-ed9058368fc4', '5b6c0533-d6bf-4437-8ea5-86814c7fbe37', 'SHS Hat', 'Flowrence', '12.349', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('b6be0ae4-675d-4fec-a3d2-a1371a206ada', '5b6c0533-d6bf-4437-8ea5-86814c7fbe37', 'Wool Hat', 'Uniworth', '5.23', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('f0dfaca7-7929-4b9e-b531-e644bcecc49d', 'b8586e1b-09f6-490d-bf6a-3f18df089af7', 'Parachute Jacket', 'Versace', '50.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('60cbc982-d143-4bad-a8e4-b6c458fe3efa', 'b8586e1b-09f6-490d-bf6a-3f18df089af7', 'Puffer with Hoodie', 'Super', '12.35', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('49019296-1926-455b-82bb-ca2fc73b3c26', 'b8586e1b-09f6-490d-bf6a-3f18df089af7', 'Raincoat Style Jacket', 'SuperDry', '65.01', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('39f309eb-fa37-4db6-b72c-30c83a4ab8b8', 'b8586e1b-09f6-490d-bf6a-3f18df089af7', 'Jeans Jacket', 'Levis', '12.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('d56ef72f-37f5-42bb-b76a-fc12ab933570', 'b8586e1b-09f6-490d-bf6a-3f18df089af7', 'Two Shades Parachute', 'SuperDry', '3.94', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('df94e0a0-fe85-42eb-9753-60e1b96fdafa', 'df8b25af-0705-4288-b331-389d2db86096', 'Jeans Shorts', 'Versace', '4.59', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('b20bbb23-2de3-4e11-9f03-e8eed8eee9d9', 'df8b25af-0705-4288-b331-389d2db86096', 'Red Bed Shorts', 'Uniworth', '7.23', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('2783d3ac-899d-478f-aeb3-4cefd99dcab9', 'df8b25af-0705-4288-b331-389d2db86096', 'Round-up Jeans', 'Cougar', '5.55', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('1da2694a-d6b2-4e6f-b3f1-50a6c58b0b47', 'df8b25af-0705-4288-b331-389d2db86096', 'Nylon Shorts', 'Outfitters', '2.34', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('692ea4f4-93b9-4208-b768-0ca39d4523b8', 'df8b25af-0705-4288-b331-389d2db86096', 'Nightie Shorts', 'Outfitters', '1.50', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('25d01f8e-b0d9-4121-8f50-fdc59fbb5637', 'ae53764d-58e1-42d5-958e-b616e9663473', 'All Season Polo', 'Uniworth', '4.39', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('5e81379f-8e8e-4e88-84c6-c212fa9868f6', 'ae53764d-58e1-42d5-958e-b616e9663473', 'Check T-Shirt', 'Uniworth', '5.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('84173162-2246-4205-bf9c-7837fa02a54e', 'ae53764d-58e1-42d5-958e-b616e9663473', 'Fained T-Shirt', 'Uniworth', '3.45', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('a2f3e906-5d1e-4fa7-b442-8c6ac4d9a5b3', 'ae53764d-58e1-42d5-958e-b616e9663473', 'Funky Disco T-Shirt', 'Outfitters', '5.00', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('85dd31bb-db8b-4a82-9cb1-922fd74592a5', 'ae53764d-58e1-42d5-958e-b616e9663473', 'Velvet T-Shirt', 'One', '6.85', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('f8a1a80d-69be-4b89-82c2-46fb48449089', 'e2b51511-e5ed-4936-96ff-6ce7987c147f', 'Lines Dress Shirt', 'Master', '7.23', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('6cc4957d-463b-45bf-96da-d48ad61d0fbe', 'e2b51511-e5ed-4936-96ff-6ce7987c147f', 'Black Box Shirt', 'Uniworth', '4.34', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('257a423a-1d30-4e0e-8487-ce9c2ed4509f', 'e2b51511-e5ed-4936-96ff-6ce7987c147f', 'Grey Box Shirt', 'Cotton Candy', '3.43', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('da976b65-950d-496e-be8d-746c3e01de57', 'e2b51511-e5ed-4936-96ff-6ce7987c147f', 'Checkers Shirt', 'Gucci', '4.32', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('c13a045f-7c50-4b86-9bf4-f89df5a2e053', 'e2b51511-e5ed-4936-96ff-6ce7987c147f', 'Dot Shirt', 'Khaddi', '3.45', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('4187174c-7294-4de9-ae18-e28bb00582b5', 'd9feba45-a55e-476c-9e10-37fb140e6aaa', 'Round-neck Shirt', 'Khaddi', '4.50', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('471c7067-5437-4a0d-8e1a-480e78c4618f', 'd9feba45-a55e-476c-9e10-37fb140e6aaa', 'Bordered Round-neck Shirt', 'Khaddi', '3.45', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('fbaa0774-436d-4e0b-a3fc-a7d7923e6819', 'd9feba45-a55e-476c-9e10-37fb140e6aaa', 'Butterfly Under Shirt', 'Royal Tag', '4.32', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('531b432b-a899-4a06-a81c-ad5650f4a703', 'd9feba45-a55e-476c-9e10-37fb140e6aaa', 'Be Bright Shirt', 'Levis', '4.35', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('c2f7a27f-8455-4833-afa0-b880db6101ac', 'd9feba45-a55e-476c-9e10-37fb140e6aaa', 'Nylon Stretch Shirt', 'One', '2.35', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('cfff7483-079c-46fa-a804-a459f03f81ae', 'de724059-2c5d-444d-b43d-7f8672c077d2', 'Navy Felece Hoodie', 'Saga', '3.5', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('a27e461d-a248-4a57-964d-9923e351d26b', 'de724059-2c5d-444d-b43d-7f8672c077d2', 'Fainted Felece Hoodie', 'Tuple', '4', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('e3890a02-40ce-45c6-bb1d-7bee8ca3f980', 'de724059-2c5d-444d-b43d-7f8672c077d2', 'No Zip Hoodie', 'One', '1', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('3119fcba-bd61-4696-b437-3e78b9bdcc2f', 'de724059-2c5d-444d-b43d-7f8672c077d2', 'Parachute Hoodie', 'SuperDry', '10', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('18870d09-8f61-47de-953e-c45280bb207f', 'de724059-2c5d-444d-b43d-7f8672c077d2', 'Jungle Felece Hoodie', 'Nike', '5', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('9fca9bf9-71d0-41cb-a354-730c3306587b', '0da32a59-83aa-4b03-ad59-c0c38573f098', 'Checkeered Shirt', 'Uniworth', '5', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('2a481ceb-010a-4768-9974-e88cbc5d86c3', '0da32a59-83aa-4b03-ad59-c0c38573f098', 'Fainted Grey Shirt', 'Royal Tag', '3', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('4827f428-b0bc-4b15-a18e-cbe6f8d40e6a', '0da32a59-83aa-4b03-ad59-c0c38573f098', 'Every day Casual Shirt', 'Bata', '2', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('e85ade88-d8f7-414a-b569-18d0eec320d1', '0da32a59-83aa-4b03-ad59-c0c38573f098', 'Desginer Casual Shirt', 'Gucci', '10', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('c560b662-226b-4569-930e-69077c8cc130', '0da32a59-83aa-4b03-ad59-c0c38573f098', 'Summer Casual Shirt', 'Armani', '10', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('fbf50560-2155-40f3-8a1f-fbf794668384', '6d475a28-4767-4a2c-a4b2-0ac36d61b737', 'Child Winter Shirt', 'Best and Less', '2', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('6f6054aa-8653-46c1-8742-94d0d8923b60', '6d475a28-4767-4a2c-a4b2-0ac36d61b737', 'Casual Multi Color', 'Minne Minors', '5', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('42beb4bd-0096-4063-b726-93e42f8fdd7e', '6d475a28-4767-4a2c-a4b2-0ac36d61b737', 'Wool Shirt', 'Bonanza', '5', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('423727a3-23fb-4188-914f-04f2cdea7ad7', '6d475a28-4767-4a2c-a4b2-0ac36d61b737', 'Children Pink Shirt', 'Best and Less', '3', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('c8749cbe-f3f7-48ad-8b06-d4e97850b999', '6d475a28-4767-4a2c-a4b2-0ac36d61b737', 'UK Flag Shirt', 'SuperDry', '10', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('475e248e-3fee-4e09-96fb-88315f3bf77c', '6d475a28-4767-4a2c-a4b2-0ac36d61b737', 'Fabric Shirt CV Zone', 'Cotton', '2', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('30b47626-273a-4c57-a13a-b0903a9c1375', '6d475a28-4767-4a2c-a4b2-0ac36d61b737', 'Fabric Shirt Machine', 'Cotton', '2', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('ded3fbe3-d584-48cb-9c9e-c37e87742c77', '6d475a28-4767-4a2c-a4b2-0ac36d61b737', 'Fabric Shirt Shapes', 'Cotton', '2', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('c239123c-59f6-49fa-bd2f-bf223d8e87d7', '6d475a28-4767-4a2c-a4b2-0ac36d61b737', 'Fabric Shirt Chip', 'Cotton', '2', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('98388739-081d-4ef1-8e88-0eb5cf107b30', '0da32a59-83aa-4b03-ad59-c0c38573f098', 'Fabric Style Shirt', 'Stylo', '5', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('00380cd6-754c-4cc5-9d04-1a08d74eff6a', '193aa98f-320c-4a7a-9923-a20b0e7ba8fe', 'Parachute Jacket', 'Minnie Minors', '5', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('f5531195-fb71-48ba-a347-71e39e08c212', '193aa98f-320c-4a7a-9923-a20b0e7ba8fe', 'Collor Jacket', 'Caterpillar', '10', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('c923e0be-f00a-4fd4-a951-4437dda0c4b0', '193aa98f-320c-4a7a-9923-a20b0e7ba8fe', 'Fabric Checkers Jacket', 'Gucci', '20', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('466afa32-c907-4f0d-8616-aa514394ebb1', '193aa98f-320c-4a7a-9923-a20b0e7ba8fe', 'Designer Zipper Jacket', 'SuperDry', '20', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('ac40dc51-638f-4102-bf36-f8dfd747cddd', '193aa98f-320c-4a7a-9923-a20b0e7ba8fe', 'Flowers and Leaves Jacket', 'Armani', '15', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('a30daf52-e380-4796-872c-c7ebd2b4de04', '925ea5bc-04d1-47fb-b238-1b7a37ed0450', 'Fabric Jacket', 'Uniworth', '10', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('c9dcbba3-acb1-454f-81b3-a1e7d00228b4', '925ea5bc-04d1-47fb-b238-1b7a37ed0450', 'Parachute Jacket', 'Gucci', '15', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('05b9f7ab-073b-47cd-83a0-5ed4f51411cc', '925ea5bc-04d1-47fb-b238-1b7a37ed0450', 'Cotton Jacket', 'Cotton', '5', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('c205b35b-4026-427f-8718-b3bc127d9a67', '925ea5bc-04d1-47fb-b238-1b7a37ed0450', 'Flowers Jacket', 'Armani', '30', 'gbp', NULL, '');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item ("id", "category_id", "name", "brand", "price", "currency", "description", "lens_id") VALUES('d1072722-8bcd-4151-842b-911d432b1377', '925ea5bc-04d1-47fb-b238-1b7a37ed0450', 'Plain Jacket', 'Polo', '15', 'gbp', NULL, '');`,
      ]);
      console.log("populated inventory items data");
    } catch (error) {
      console.log(
        "failed to insert inventory items data in database, error: ",
        error
      );
    }
  }

  async insertInventoryDemoItems() {
    try {
      const result =
        await prisma.$executeRaw`SELECT * FROM public.inventory_demo_item LIMIT 1;`;

      if (result == 1) {
        console.log("data already exists for inventory demo item table");
        return;
      }
    } catch (error) {
      console.log(
        "failed to query inventory demo item table to verify records existence, error: ",
        error
      );
      return;
    }

    try {
      await prisma.$transaction([
        prisma.$executeRaw`INSERT INTO public.inventory_demo_item ("item_id", "is_demo_item", "created_at", "modified_at") VALUES('555e3f63-f927-4b76-93cd-098ee5fbde4e', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_item ("item_id", "is_demo_item", "created_at", "modified_at") VALUES('2f97defc-964c-45b8-b8e4-5ce85892cd90', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_item ("item_id", "is_demo_item", "created_at", "modified_at") VALUES('e68e6704-906b-4ac6-8349-be4032fe899e', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_item ("item_id", "is_demo_item", "created_at", "modified_at") VALUES('3d056ef8-11fb-40f0-8eeb-ff8e0d685a4b', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_item ("item_id", "is_demo_item", "created_at", "modified_at") VALUES('f0dfaca7-7929-4b9e-b531-e644bcecc49d', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_item ("item_id", "is_demo_item", "created_at", "modified_at") VALUES('df94e0a0-fe85-42eb-9753-60e1b96fdafa', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_item ("item_id", "is_demo_item", "created_at", "modified_at") VALUES('25d01f8e-b0d9-4121-8f50-fdc59fbb5637', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_item ("item_id", "is_demo_item", "created_at", "modified_at") VALUES('f8a1a80d-69be-4b89-82c2-46fb48449089', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_item ("item_id", "is_demo_item", "created_at", "modified_at") VALUES('4187174c-7294-4de9-ae18-e28bb00582b5', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_item ("item_id", "is_demo_item", "created_at", "modified_at") VALUES('cfff7483-079c-46fa-a804-a459f03f81ae', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_item ("item_id", "is_demo_item", "created_at", "modified_at") VALUES('9fca9bf9-71d0-41cb-a354-730c3306587b', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_item ("item_id", "is_demo_item", "created_at", "modified_at") VALUES('fbf50560-2155-40f3-8a1f-fbf794668384', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_item ("item_id", "is_demo_item", "created_at", "modified_at") VALUES('00380cd6-754c-4cc5-9d04-1a08d74eff6a', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_demo_item ("item_id", "is_demo_item", "created_at", "modified_at") VALUES('a30daf52-e380-4796-872c-c7ebd2b4de04', true, '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      ]);
      console.log("populated inventory demo items data");
    } catch (error) {
      console.log(
        "failed to insert inventory demo items data in database, error: ",
        error
      );
    }
  }

  async insertInventoryItemColors() {
    try {
      const result =
        await prisma.$executeRaw`SELECT * FROM public.inventory_item_color LIMIT 1;`;

      if (result == 1) {
        console.log("data already exists for inventory item color table");
        return;
      }
    } catch (error) {
      console.log(
        "failed to query inventory item color table to verify records existence, error: ",
        error
      );
      return;
    }

    try {
      await prisma.$transaction([
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('41c1b7a8-9e83-4a7b-abba-ac4cf94acce7', '555e3f63-f927-4b76-93cd-098ee5fbde4e', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('c3bb791c-4a6b-4044-929d-f2f464bf43cc', '555e3f63-f927-4b76-93cd-098ee5fbde4e', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('56ebed06-72a7-4409-984b-637fcf8264ec', '555e3f63-f927-4b76-93cd-098ee5fbde4e', 'Grey', '#808080');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('f945ba50-0145-4e92-b75d-8286d2785ada', '280f0550-5ac4-4f55-8777-6b46db6e27a3', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('24db425b-5654-4bcb-baa1-f270c3ac8211', 'aec77d9e-c1d0-4678-82b2-60c6f33531ae', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('e311d4cd-598b-4f93-829c-f876f4a3f6bc', 'aec77d9e-c1d0-4678-82b2-60c6f33531ae', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('a370e766-56ad-437a-9609-c48db9752484', '5fecd45a-016b-41b2-ae2c-4a74d878963d', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('ab443faf-fb6a-4d11-aafc-c417ec8059ee', '5fecd45a-016b-41b2-ae2c-4a74d878963d', 'Grey', '#808080');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('38b00c45-05d0-4723-9c60-a0e016f00a6b', '55d70f75-c9b3-46a0-a2b5-09e9bfe9830a', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('09f710e5-fdd6-4bc0-8dab-295248628fd8', '2f97defc-964c-45b8-b8e4-5ce85892cd90', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('be45900a-8f48-495d-960c-09ad117fb859', '01cb9f7b-3aa7-46bd-8bc2-31e82eecbbfc', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('2faff527-3569-42a7-a85c-909f52fa2da3', 'e0f4d691-c624-4b6b-9896-3c451141eda3', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('0c300d74-c155-476d-8e02-644f9bc6b049', 'b53942ae-fd6b-4da0-83d5-db0a1dadc1c4', 'Khaki', '#c3b091');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('c20d7564-aa49-4c10-8c40-88b06200b75a', 'b53942ae-fd6b-4da0-83d5-db0a1dadc1c4', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('3b11bfa8-e7b0-4a42-a600-4cc8e7e275fc', 'd5e7f0e0-c6dd-4e50-b023-c18b4d5d5965', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('4a6ce81c-51f4-4553-aa29-0fb63740a1f2', 'd5e7f0e0-c6dd-4e50-b023-c18b4d5d5965', 'Green', '#00ff00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('e10e448c-41f2-45b3-8967-faaa3eae0ad2', 'd5e7f0e0-c6dd-4e50-b023-c18b4d5d5965', 'Grey', '#808080');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('c54815dc-3c97-4826-b804-2eb7387c0e9a', 'e68e6704-906b-4ac6-8349-be4032fe899e', 'Red', '#FF0000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('9469d760-d9c9-45d4-be40-f76512cf25d7', 'e68e6704-906b-4ac6-8349-be4032fe899e', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('ce030491-d1aa-427f-a7ad-786817c0240d', '6349f90e-a401-4f51-b124-c392c8faf2a1', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('825b77ba-3935-4b81-b278-e52edf6521e4', '387b06d7-b5a4-4d51-9c30-226908d870a3', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('ce6465dc-fffd-467e-a128-de4abad3f678', '387b06d7-b5a4-4d51-9c30-226908d870a3', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('06588398-d4c5-4918-80a6-ba852fad6522', '64c88b4c-5d99-41bf-b523-cf92c61aa3d8', 'Yellow', '#FFFF00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('4feeab66-8f9d-4087-9f18-8356d1d39c19', '64c88b4c-5d99-41bf-b523-cf92c61aa3d8', 'Red', '#FF0000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('8bdb6338-eb3e-48b9-8a06-997b2b5fe8ce', '64c88b4c-5d99-41bf-b523-cf92c61aa3d8', 'Pink', '#FFC0CB');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('d3b0b99c-225e-4320-b8ca-1fdf4dc24948', '297e9cd4-73b1-4ad0-a8d8-8325c0de9a66', 'Brown', '#A52A2A');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('1b1e79d5-08b5-4dfb-8900-ab0d224f18b2', '3d056ef8-11fb-40f0-8eeb-ff8e0d685a4b', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('a804736a-8692-423f-9dc5-c9c34e0bd61b', 'ea599675-6d31-4467-b5a9-7799fe528971', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('508b73aa-f334-4fd7-bfe6-371537097129', 'ea599675-6d31-4467-b5a9-7799fe528971', 'Pink', '#FFC0CB');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('f50cc18d-6537-4eee-b6a7-4bef3453a827', 'c940961e-f12e-476f-8076-a78634cf0d2b', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('dd7bec2e-8766-4cba-ab17-8683a0f13b5d', 'c940961e-f12e-476f-8076-a78634cf0d2b', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('78e0d11e-85b8-4c7c-af97-852f13624f13', 'd62ede80-8792-43fb-9663-ed9058368fc4', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('e2b0a073-0f2e-4317-b60d-9e532cc06f1f', 'b6be0ae4-675d-4fec-a3d2-a1371a206ada', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('6925b419-dd9f-41f7-982a-4f538a48a225', 'f0dfaca7-7929-4b9e-b531-e644bcecc49d', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('eef9ec5c-4012-42bf-ae5a-6e7c777bc026', 'f0dfaca7-7929-4b9e-b531-e644bcecc49d', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('cb8600a6-0e45-4798-ac4f-da75ce0cd719', '60cbc982-d143-4bad-a8e4-b6c458fe3efa', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('3e1d6056-3c88-44cd-a06d-4b70ef76e324', '60cbc982-d143-4bad-a8e4-b6c458fe3efa', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('60dd972c-0c77-4e79-852c-6d7ccfcfedee', '49019296-1926-455b-82bb-ca2fc73b3c26', 'Yellow', '#FFFF00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('a8b0b868-342d-4d09-8c4e-22ea784ec04c', '39f309eb-fa37-4db6-b72c-30c83a4ab8b8', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('68764138-44fa-4afc-82e9-8f0ca2a02f48', '39f309eb-fa37-4db6-b72c-30c83a4ab8b8', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('fbf9fa67-5362-465d-a78c-c63caa060f78', 'd56ef72f-37f5-42bb-b76a-fc12ab933570', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('0d05858b-3f14-4768-a9d7-f2d324d94bec', 'd56ef72f-37f5-42bb-b76a-fc12ab933570', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('d8921dc0-5fc1-4513-8cda-58bc2d3a53c4', 'df94e0a0-fe85-42eb-9753-60e1b96fdafa', 'Khaki', '#c3b091');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('d64ea8db-6b1d-4bad-acde-a8e281815213', 'df94e0a0-fe85-42eb-9753-60e1b96fdafa', 'Brown', '#A52A2A');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('bb95f294-4c6d-425f-8e13-97812a16e957', 'b20bbb23-2de3-4e11-9f03-e8eed8eee9d9', 'Red', '#FF0000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('a1a80ff1-4922-41fc-aee5-021fba3db9ca', 'b20bbb23-2de3-4e11-9f03-e8eed8eee9d9', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('9aab222e-003d-43d4-ac75-e466ae71aa5d', '2783d3ac-899d-478f-aeb3-4cefd99dcab9', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('12f8361d-bb79-4844-b477-44f25a57cafb', '2783d3ac-899d-478f-aeb3-4cefd99dcab9', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('2fda25a6-225c-45d0-bcd9-e90a08ae0ccb', '1da2694a-d6b2-4e6f-b3f1-50a6c58b0b47', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('5349e4cd-f10b-46b1-b8e5-5921b0286c2d', '1da2694a-d6b2-4e6f-b3f1-50a6c58b0b47', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('2f1e7bb8-6980-41be-bc42-92839b83f73b', '692ea4f4-93b9-4208-b768-0ca39d4523b8', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('a822c255-cf00-4ad5-b45b-795833030ebb', '692ea4f4-93b9-4208-b768-0ca39d4523b8', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('880d0dce-cede-486e-b715-a76cbe2e8705', '25d01f8e-b0d9-4121-8f50-fdc59fbb5637', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('2d778bbe-5248-4335-b1c9-fd63df09a06e', '25d01f8e-b0d9-4121-8f50-fdc59fbb5637', 'Grey', '#808080');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('7b5d9d26-69c9-46e3-9310-ea135d1dedd6', '5e81379f-8e8e-4e88-84c6-c212fa9868f6', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('0609fc87-8ebe-471a-a140-4a1870c009da', '5e81379f-8e8e-4e88-84c6-c212fa9868f6', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('8ac44774-cf82-4a2e-bd9d-e15805284f4c', '84173162-2246-4205-bf9c-7837fa02a54e', 'Grey', '#808080');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('5e53afe8-d51c-4665-b4d5-a7f507917592', '84173162-2246-4205-bf9c-7837fa02a54e', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('d7ba94a8-b0f9-447d-a62f-88a5daf086a9', 'a2f3e906-5d1e-4fa7-b442-8c6ac4d9a5b3', 'Orange', '#FFA500');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('9e0e69b3-70de-4aa0-9657-3172a1802306', '85dd31bb-db8b-4a82-9cb1-922fd74592a5', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('5026b690-5995-4bf2-9418-cd6560f3174b', 'f8a1a80d-69be-4b89-82c2-46fb48449089', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('0b233ec3-3187-4a3e-885f-972adaf18584', '6cc4957d-463b-45bf-96da-d48ad61d0fbe', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('f482b85f-e3f3-4439-930f-f72cc0b4f4ca', '6cc4957d-463b-45bf-96da-d48ad61d0fbe', 'Purple', '#A020F0');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('2e7a7aa0-3737-46c1-a454-0f3b5fab23f3', '257a423a-1d30-4e0e-8487-ce9c2ed4509f', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('6ea41428-f8b5-45a7-b4b3-db0f261b7156', '257a423a-1d30-4e0e-8487-ce9c2ed4509f', 'Grey', '#808080');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('d1639059-7cff-4c1c-82bb-287ab156c008', 'da976b65-950d-496e-be8d-746c3e01de57', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('fd7664b2-858d-4afc-bf34-be612d0c2fc1', 'c13a045f-7c50-4b86-9bf4-f89df5a2e053', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('32f35e7d-7e2a-4472-b900-461ae6129a0b', 'c13a045f-7c50-4b86-9bf4-f89df5a2e053', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('c7f87347-98f4-4c5c-b750-fd48510cebe0', '4187174c-7294-4de9-ae18-e28bb00582b5', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('1ef68c9e-da92-4003-8a48-2ce18e8feda5', '4187174c-7294-4de9-ae18-e28bb00582b5', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('2547811c-655c-4309-a2a6-f2ddcdc6f67f', '471c7067-5437-4a0d-8e1a-480e78c4618f', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('cb79087a-8fe9-4013-a80a-bac724dafcce', '471c7067-5437-4a0d-8e1a-480e78c4618f', 'Grey', '#808080');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('cf4ff0a4-df4a-4983-8a93-5fd964f3d4ce', 'fbaa0774-436d-4e0b-a3fc-a7d7923e6819', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('2f14c307-cd05-4975-aae7-67b91ac5ea73', '531b432b-a899-4a06-a81c-ad5650f4a703', 'Grey', '#808080');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('ba7e6741-5093-4cf8-b067-1ab4f37a92f1', '531b432b-a899-4a06-a81c-ad5650f4a703', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('fb5bf775-526d-438e-9a18-0aa2853e8ebb', 'c2f7a27f-8455-4833-afa0-b880db6101ac', 'Grey', '#808080');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('65385ee7-81e7-4c3d-adc2-475ff718aa77', 'c2f7a27f-8455-4833-afa0-b880db6101ac', 'Navy', '#000035');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('2120ee55-c964-4f22-a2d6-4b896acd5391', 'cfff7483-079c-46fa-a804-a459f03f81ae', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('c7b12d79-ee42-4d42-b71a-4b43159e4d6f', 'cfff7483-079c-46fa-a804-a459f03f81ae', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('00f18c86-d3b1-4ff2-9f5b-208ae72b70cc', 'a27e461d-a248-4a57-964d-9923e351d26b', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('d7605466-b516-4396-8600-0aaa43dc4fc2', 'a27e461d-a248-4a57-964d-9923e351d26b', 'Red', '#FF0000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('84d6343e-5ab9-4acc-8c6f-9d51f72a7e3b', 'e3890a02-40ce-45c6-bb1d-7bee8ca3f980', 'Purple', '#A020F0');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('236665f7-3cfc-48e3-ab06-7b8449521a46', 'e3890a02-40ce-45c6-bb1d-7bee8ca3f980', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('5a36f5c0-4c32-4657-a623-10dc4c494189', '3119fcba-bd61-4696-b437-3e78b9bdcc2f', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('168ce82e-5251-4bab-8c93-7e842de66441', '3119fcba-bd61-4696-b437-3e78b9bdcc2f', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('0b814e9f-a66f-424d-a118-457ab955fa5c', '18870d09-8f61-47de-953e-c45280bb207f', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('fa7ad125-54e5-495b-93aa-330d52eb385f', '18870d09-8f61-47de-953e-c45280bb207f', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('e7a201d5-069e-45f5-9df6-3d97964983f0', '9fca9bf9-71d0-41cb-a354-730c3306587b', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('fa2032b3-c028-4ecd-a5b2-abd73786e948', '9fca9bf9-71d0-41cb-a354-730c3306587b', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('e0fbb07d-8c2b-4c0f-9790-1731590ef143', '2a481ceb-010a-4768-9974-e88cbc5d86c3', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('b61a3201-3498-48df-8e0e-e447d8c9a84c', '2a481ceb-010a-4768-9974-e88cbc5d86c3', 'Grey', '#808080');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('2641afc7-c70c-49f1-b041-311f2ecefde3', '4827f428-b0bc-4b15-a18e-cbe6f8d40e6a', 'Blur', '#eae9ee');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('fff05d7e-18d0-4f10-a5a4-7a76fe612013', '4827f428-b0bc-4b15-a18e-cbe6f8d40e6a', 'Purple', '#A020F0');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('7f412807-ca74-4896-b6b5-789775777f87', 'e85ade88-d8f7-414a-b569-18d0eec320d1', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('f2b18efc-7d41-414d-be7e-81ea7767f84a', 'e85ade88-d8f7-414a-b569-18d0eec320d1', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('620be35c-e47a-4e1b-8d91-d2cfe1a93ac2', 'c560b662-226b-4569-930e-69077c8cc130', 'Grey', '#808080');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('c9b85b7b-2ad5-451b-9623-f3e9e1b32843', 'c560b662-226b-4569-930e-69077c8cc130', 'Brown', '#A52A2A');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('6c8fc8bc-73bf-4100-b87c-d12791a26beb', 'fbf50560-2155-40f3-8a1f-fbf794668384', 'Red', '#FF0000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('f65e077d-fe93-4e09-9e87-b14562570956', 'fbf50560-2155-40f3-8a1f-fbf794668384', 'Green', '#00ff00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('9189a736-e89d-402c-94cf-243f4b8c0ba3', '6f6054aa-8653-46c1-8742-94d0d8923b60', 'Purple', '#A020F0');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('0ea41d85-3184-476a-b4e9-0d7f259e9997', '6f6054aa-8653-46c1-8742-94d0d8923b60', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('1ebdd6d6-0dc1-47ec-815f-adb55e15c4e7', '42beb4bd-0096-4063-b726-93e42f8fdd7e', 'Grey', '#808080');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('710ca550-41a9-423f-9509-d4c51fdcbb7d', '42beb4bd-0096-4063-b726-93e42f8fdd7e', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('18ba8d35-c8ff-46cb-a01c-fb6f9eb76106', '423727a3-23fb-4188-914f-04f2cdea7ad7', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('3c2fef63-b952-48ef-86c7-7cf4e5b64d66', '423727a3-23fb-4188-914f-04f2cdea7ad7', 'Pink', '#FFC0CB');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('8d3d066b-0be3-44b1-b7ee-6d823984eef8', 'c8749cbe-f3f7-48ad-8b06-d4e97850b999', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('3a5a958e-f88a-4506-a245-97e175bf8837', '00380cd6-754c-4cc5-9d04-1a08d74eff6a', 'Pink', '#FFC0CB');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('90110a2e-388f-42be-9479-52faaceb1411', '00380cd6-754c-4cc5-9d04-1a08d74eff6a', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('7c12bf45-4032-4ea9-8077-50a5c65b84f7', 'f5531195-fb71-48ba-a347-71e39e08c212', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('66b0db9d-f6df-46dc-a17f-9e6e8586642c', 'f5531195-fb71-48ba-a347-71e39e08c212', 'Navy Blue', '#000080');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('66a807fb-4519-4331-a85a-b332988f245b', 'c923e0be-f00a-4fd4-a951-4437dda0c4b0', 'Purple', '#A020F0');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('823b4eb0-676f-4915-bfb5-2fd76f9f4208', 'c923e0be-f00a-4fd4-a951-4437dda0c4b0', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('7a6c27d2-7678-4d74-b3cb-c1255bb8939e', '466afa32-c907-4f0d-8616-aa514394ebb1', 'Green', '#00ff00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('27a11efe-89c3-449c-84da-7cf3db0cad5a', '466afa32-c907-4f0d-8616-aa514394ebb1', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('36f2830b-ce23-42f1-916b-1a994dbfff64', 'ac40dc51-638f-4102-bf36-f8dfd747cddd', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('a9965938-4736-4892-910d-956569ee9135', 'a30daf52-e380-4796-872c-c7ebd2b4de04', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('ad2f2a0c-b982-413a-95f3-5e1b7e920dd6', 'a30daf52-e380-4796-872c-c7ebd2b4de04', 'Grey', '#808080');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('f21ee172-77f9-4ad3-869d-1c78b2115d58', 'c9dcbba3-acb1-454f-81b3-a1e7d00228b4', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('a62b04a7-7ac8-452b-9c9c-aa06b6d72618', '05b9f7ab-073b-47cd-83a0-5ed4f51411cc', 'White', '#FFFFFF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('eab7955d-0daf-416a-9b5f-df0d261fd460', '05b9f7ab-073b-47cd-83a0-5ed4f51411cc', 'Grey', '#808080');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('1c584f50-cf73-4650-bf7f-3bda3a0d07ea', 'c205b35b-4026-427f-8718-b3bc127d9a67', 'Yellow', '#FFFF00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('ad421c0c-75b7-41df-ab97-09413d879168', 'd1072722-8bcd-4151-842b-911d432b1377', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('8029a529-42fa-484d-8184-a5c7f3d75611', 'd1072722-8bcd-4151-842b-911d432b1377', 'Black', '#000000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('c16b0dfe-e182-4b54-bf8e-34051aeea551', '475e248e-3fee-4e09-96fb-88315f3bf77c', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('a100da26-2c4c-413a-be22-8d78939ed07c', '30b47626-273a-4c57-a13a-b0903a9c1375', 'Green', '#00ff00');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('6721cebe-0ec0-42d9-b1e5-b91eda6b594e', 'ded3fbe3-d584-48cb-9c9e-c37e87742c77', 'Red', '#FF0000');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('12404d62-0501-407f-bb1a-bec8e11e32a9', 'c239123c-59f6-49fa-bd2f-bf223d8e87d7', 'Blue', '#0000FF');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_color ("id", "item_id", "color", "color_hex") VALUES('c7d2319f-aad5-4488-9b3e-d7cdef7697aa', '98388739-081d-4ef1-8e88-0eb5cf107b30', 'Green', '#00ff00');`,
      ]);
      console.log("populated inventory item colors data");
    } catch (error) {
      console.log(
        "failed to insert inventory item colors data in database, error: ",
        error
      );
    }
  }

  async insertInventoryItemSizes() {
    try {
      const result =
        await prisma.$executeRaw`SELECT * FROM public.inventory_item_size LIMIT 1;`;

      if (result == 1) {
        console.log("data already exists for inventory item size table");
        return;
      }
    } catch (error) {
      console.log(
        "failed to query inventory item size table to verify records existence, error: ",
        error
      );
      return;
    }

    try {
      await prisma.$transaction([
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('41c1b7a8-9e83-4a7b-abba-ac4cf94acce7', '555e3f63-f927-4b76-93cd-098ee5fbde4e', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('c3bb791c-4a6b-4044-929d-f2f464bf43cc', '555e3f63-f927-4b76-93cd-098ee5fbde4e', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('56ebed06-72a7-4409-984b-637fcf8264ec', '555e3f63-f927-4b76-93cd-098ee5fbde4e', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('1f26c439-0cbf-433d-8308-e1174f907407', '280f0550-5ac4-4f55-8777-6b46db6e27a3', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('173ec23c-6855-4ba9-8bd4-fb4ee09afb53', 'aec77d9e-c1d0-4678-82b2-60c6f33531ae', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('8f37df07-f513-4d3c-a79c-eccfbdad1dab', 'aec77d9e-c1d0-4678-82b2-60c6f33531ae', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('a370e766-56ad-437a-9609-c48db9752484', '5fecd45a-016b-41b2-ae2c-4a74d878963d', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('087da505-2967-4743-93e5-af497262b5c7', '55d70f75-c9b3-46a0-a2b5-09e9bfe9830a', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('a60ee41e-4837-44c7-9b31-901eeecf6a92', '2f97defc-964c-45b8-b8e4-5ce85892cd90', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('09f710e5-fdd6-4bc0-8dab-295248628fd8', '2f97defc-964c-45b8-b8e4-5ce85892cd90', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('c62cbebd-994f-4b03-ac96-e09b5f29211b', '01cb9f7b-3aa7-46bd-8bc2-31e82eecbbfc', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('bb4fb0b4-3f24-436b-a987-f31b9f5842c7', 'e0f4d691-c624-4b6b-9896-3c451141eda3', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('0c300d74-c155-476d-8e02-644f9bc6b049', 'b53942ae-fd6b-4da0-83d5-db0a1dadc1c4', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('c20d7564-aa49-4c10-8c40-88b06200b75a', 'b53942ae-fd6b-4da0-83d5-db0a1dadc1c4', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('6e562b04-3eb2-490a-9561-02b1e75f54f4', 'd5e7f0e0-c6dd-4e50-b023-c18b4d5d5965', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('e10e448c-41f2-45b3-8967-faaa3eae0ad2', 'd5e7f0e0-c6dd-4e50-b023-c18b4d5d5965', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('70b4b82e-588e-48a3-a4ff-d585db64339d', 'd5e7f0e0-c6dd-4e50-b023-c18b4d5d5965', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('c375e5ae-a37d-4475-9507-0a938cec8eb6', 'e68e6704-906b-4ac6-8349-be4032fe899e', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('cd5e602e-1c66-4b74-a66b-dbd4cb8b8c82', '6349f90e-a401-4f51-b124-c392c8faf2a1', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('972c38dc-4f4b-40ea-93e4-c97f7507a850', '6349f90e-a401-4f51-b124-c392c8faf2a1', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('3e2c1340-b877-4ba3-9e21-577fb08ee4d3', '387b06d7-b5a4-4d51-9c30-226908d870a3', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('7a77c7dd-0880-497b-80cc-a7ff30c26fa6', '387b06d7-b5a4-4d51-9c30-226908d870a3', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('90dc7c0b-a6cd-4cd7-ad34-97d4fae98123', '64c88b4c-5d99-41bf-b523-cf92c61aa3d8', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('06588398-d4c5-4918-80a6-ba852fad6522', '64c88b4c-5d99-41bf-b523-cf92c61aa3d8', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('4feeab66-8f9d-4087-9f18-8356d1d39c19', '64c88b4c-5d99-41bf-b523-cf92c61aa3d8', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('55a4b8bf-fbd7-4677-b632-3f8f13299922', '297e9cd4-73b1-4ad0-a8d8-8325c0de9a66', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('bed704a0-7f3f-44aa-bf39-bbfe0e08f357', '297e9cd4-73b1-4ad0-a8d8-8325c0de9a66', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('fd811f43-fc55-4f44-88d3-51d9911801b8', '3d056ef8-11fb-40f0-8eeb-ff8e0d685a4b', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('0dab6143-6b94-452c-8e89-5d2cbb661062', 'ea599675-6d31-4467-b5a9-7799fe528971', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('86df53ff-a74c-4ffc-90c8-db9cdbc18a60', 'c940961e-f12e-476f-8076-a78634cf0d2b', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('603ae950-29be-4bd7-8bb8-315a25b4d8f9', 'd62ede80-8792-43fb-9663-ed9058368fc4', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('876329de-d8b2-446a-9638-cb48686b13fd', 'd62ede80-8792-43fb-9663-ed9058368fc4', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('25fcbf3d-4b5d-47d4-b915-663bd49bf6c3', 'b6be0ae4-675d-4fec-a3d2-a1371a206ada', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('55b8acde-2f05-43e3-8024-bd8be6641d68', 'f0dfaca7-7929-4b9e-b531-e644bcecc49d', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('35f2e64c-74a6-4df4-8172-82f0d1044600', 'f0dfaca7-7929-4b9e-b531-e644bcecc49d', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('e15b912c-7958-442e-a142-9fa45c427bca', '60cbc982-d143-4bad-a8e4-b6c458fe3efa', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('ad2e9199-e5ad-458d-a440-39aab12001d6', '60cbc982-d143-4bad-a8e4-b6c458fe3efa', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('5d422ad3-b800-4121-b508-94c29c5b0791', '60cbc982-d143-4bad-a8e4-b6c458fe3efa', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('ac1fda0a-76f6-4571-95ff-f3c310704687', '49019296-1926-455b-82bb-ca2fc73b3c26', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('08748c1f-6b1b-4e10-92ce-e5278dd3bca4', '49019296-1926-455b-82bb-ca2fc73b3c26', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('5bbe6497-5c1f-4c47-8fdd-2053ce35c2e0', '39f309eb-fa37-4db6-b72c-30c83a4ab8b8', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('65629271-da82-4160-b5e2-7db025edf7f0', 'd56ef72f-37f5-42bb-b76a-fc12ab933570', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('fae62b87-66f5-4c85-8cdc-378cd90d2dbf', 'd56ef72f-37f5-42bb-b76a-fc12ab933570', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('958b1ab4-589e-41df-9698-f4e3e975fe06', 'df94e0a0-fe85-42eb-9753-60e1b96fdafa', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('d9034bc2-9f73-4df9-86f5-b029bcfc86a2', 'df94e0a0-fe85-42eb-9753-60e1b96fdafa', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('f73d70fc-b733-459f-ae6a-a8f18abd7673', 'b20bbb23-2de3-4e11-9f03-e8eed8eee9d9', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('9ec8fc2b-b722-40b0-af04-35e9f3c5a8ce', 'b20bbb23-2de3-4e11-9f03-e8eed8eee9d9', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('ca3735b6-3ac8-4761-93d5-90775471c706', '2783d3ac-899d-478f-aeb3-4cefd99dcab9', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('cc380272-1a5e-4e16-9597-b60ea957e654', '2783d3ac-899d-478f-aeb3-4cefd99dcab9', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('b03b0757-4fb7-4888-b82f-f956abb89093', '1da2694a-d6b2-4e6f-b3f1-50a6c58b0b47', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('d818e6eb-3b3d-4ed9-aee2-87f12d615c5e', '1da2694a-d6b2-4e6f-b3f1-50a6c58b0b47', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('9ad38c6d-2f0c-4236-a03a-c55751a84be5', '692ea4f4-93b9-4208-b768-0ca39d4523b8', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('160ba35f-187d-4ad2-8858-908be9636358', '692ea4f4-93b9-4208-b768-0ca39d4523b8', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('819d2a8b-a879-4105-8b54-dc6a74c6a57d', '25d01f8e-b0d9-4121-8f50-fdc59fbb5637', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('8dc348e5-4ec3-44ca-b5b0-9de034a20ff0', '25d01f8e-b0d9-4121-8f50-fdc59fbb5637', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('03b11ac5-61d9-489c-a2e1-94f56097590f', '5e81379f-8e8e-4e88-84c6-c212fa9868f6', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('1b701d70-d098-4293-82bd-e5a33fc22357', '5e81379f-8e8e-4e88-84c6-c212fa9868f6', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('e4da4b7a-9430-4dbc-b94f-bb9c62607c5d', '84173162-2246-4205-bf9c-7837fa02a54e', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('0f6f8b4b-a752-4331-9d74-61b7a002f4dd', '84173162-2246-4205-bf9c-7837fa02a54e', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('033b58b4-df19-457e-b93a-e98e75fb05d9', 'a2f3e906-5d1e-4fa7-b442-8c6ac4d9a5b3', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('d2ff0385-22e5-4aec-b770-6a7e2739d2a8', 'a2f3e906-5d1e-4fa7-b442-8c6ac4d9a5b3', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('4c37fcb9-ad35-4c9d-9d5d-26a3f9cb4ff5', '85dd31bb-db8b-4a82-9cb1-922fd74592a5', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('f736052b-42d0-41ce-8641-29fc6d789711', 'f8a1a80d-69be-4b89-82c2-46fb48449089', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('9d00ce40-edcc-4bc3-922b-40b8c62dfefc', 'f8a1a80d-69be-4b89-82c2-46fb48449089', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('0cd4dc04-3c95-47bb-bc67-406d55784708', '6cc4957d-463b-45bf-96da-d48ad61d0fbe', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('2ccac355-79c9-4afc-81e6-f65bdf3e68ca', '6cc4957d-463b-45bf-96da-d48ad61d0fbe', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('de45fda4-b0cc-4a24-aabc-cb295a16ac6e', '257a423a-1d30-4e0e-8487-ce9c2ed4509f', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('3943eccc-387e-4fd8-ba39-0fc02efa9c44', '257a423a-1d30-4e0e-8487-ce9c2ed4509f', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('f5ccd040-5f69-4cc3-92c3-883b16bc03f1', 'da976b65-950d-496e-be8d-746c3e01de57', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('828ad502-0aa4-4757-8ce2-64f1a34c447e', 'c13a045f-7c50-4b86-9bf4-f89df5a2e053', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('7d518984-0019-459e-9bd0-9faf43d103c8', 'c13a045f-7c50-4b86-9bf4-f89df5a2e053', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('edb84083-258a-437e-b609-a393512a6b57', '4187174c-7294-4de9-ae18-e28bb00582b5', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('bffa4dd2-d500-4ba4-bb30-4135b2f47f5d', '4187174c-7294-4de9-ae18-e28bb00582b5', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('c3023b99-f431-4139-af37-e0fba5849dd3', '471c7067-5437-4a0d-8e1a-480e78c4618f', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('f232803b-7533-4237-9348-54bfdb20df31', '471c7067-5437-4a0d-8e1a-480e78c4618f', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('61d529a1-256c-46ad-88e4-d8b474b69a57', 'fbaa0774-436d-4e0b-a3fc-a7d7923e6819', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('c44f0e6d-cd35-4f06-bed6-65a36ff0c68f', 'fbaa0774-436d-4e0b-a3fc-a7d7923e6819', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('2b865b41-820f-4b54-b564-db686da7150d', '531b432b-a899-4a06-a81c-ad5650f4a703', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('8a186315-1bac-48d0-a454-fb4e8b76d291', '531b432b-a899-4a06-a81c-ad5650f4a703', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('60dc9805-e32e-4a1c-8d00-c53310538399', 'c2f7a27f-8455-4833-afa0-b880db6101ac', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('cd451c02-cac3-46c6-8397-7a89602562f6', 'c2f7a27f-8455-4833-afa0-b880db6101ac', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('354b3f38-282b-46ff-bc8a-112a8725c4ad', 'cfff7483-079c-46fa-a804-a459f03f81ae', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('c0aa2e55-ed27-4b06-b242-ecef042bac1f', 'cfff7483-079c-46fa-a804-a459f03f81ae', 'Extra Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('9bc03dce-b4c4-4e24-a77a-8de5a829376b', 'a27e461d-a248-4a57-964d-9923e351d26b', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('1c8abc0a-13da-42f1-a8fb-f6aee26f728e', 'a27e461d-a248-4a57-964d-9923e351d26b', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('61a4de53-34bd-475a-9f4d-3e59e6c472e9', 'e3890a02-40ce-45c6-bb1d-7bee8ca3f980', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('bbb15ca2-a34c-4be4-87cd-4fd0e20e50ef', 'e3890a02-40ce-45c6-bb1d-7bee8ca3f980', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('a10ee722-1497-4322-958f-91d48355fc3c', '3119fcba-bd61-4696-b437-3e78b9bdcc2f', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('d5b60b75-e332-44d3-95bc-0c2163ea4382', '18870d09-8f61-47de-953e-c45280bb207f', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('4159c88f-d952-4e9d-a640-671abc73fce4', '18870d09-8f61-47de-953e-c45280bb207f', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('3f01ad13-5823-450a-9599-7b89834efdb0', '9fca9bf9-71d0-41cb-a354-730c3306587b', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('51ba4018-edb7-40a7-b698-a41ac0f0c9bb', '2a481ceb-010a-4768-9974-e88cbc5d86c3', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('ddea6b39-a63a-42d5-a323-9bb1a323d25f', '2a481ceb-010a-4768-9974-e88cbc5d86c3', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('054c57c3-90bf-432b-a41b-22aa7e1369ab', '4827f428-b0bc-4b15-a18e-cbe6f8d40e6a', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('20175688-f3e7-451f-9ca0-8d97cc59d87b', '4827f428-b0bc-4b15-a18e-cbe6f8d40e6a', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('a8aa16ec-2697-4acd-88b3-461d6d234ebd', 'e85ade88-d8f7-414a-b569-18d0eec320d1', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('bf895498-870c-4418-b3fb-589b03bcdf41', 'e85ade88-d8f7-414a-b569-18d0eec320d1', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('d78f4f09-39e6-42df-b4e0-aa200baf9ef9', 'c560b662-226b-4569-930e-69077c8cc130', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('c9c8cbb2-d261-4e43-8c4b-3516866352b4', 'c560b662-226b-4569-930e-69077c8cc130', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('4239d926-3f75-48e7-80d7-f5fd5873bb4a', 'fbf50560-2155-40f3-8a1f-fbf794668384', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('19349da0-fc25-4726-bc76-2ac2b1f9e0c1', '6f6054aa-8653-46c1-8742-94d0d8923b60', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('903dcba8-d934-42bb-9d13-61747abd7ea6', '42beb4bd-0096-4063-b726-93e42f8fdd7e', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('b54fbce0-0af2-43d8-8bbf-498d57b5ed6d', '423727a3-23fb-4188-914f-04f2cdea7ad7', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('89685700-8232-4c5f-add5-991688666e14', 'c8749cbe-f3f7-48ad-8b06-d4e97850b999', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('0075a9a9-2c39-4e28-9c20-c60f2bd47054', '00380cd6-754c-4cc5-9d04-1a08d74eff6a', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('5c4de76a-3bf9-4cb1-a9f0-bf6e48fa0844', '00380cd6-754c-4cc5-9d04-1a08d74eff6a', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('6d6a3331-7731-4429-8b1e-ce3d51db247c', 'f5531195-fb71-48ba-a347-71e39e08c212', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('b05f2dce-f90f-4e4a-a906-188fe28e7d36', 'f5531195-fb71-48ba-a347-71e39e08c212', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('d93d744b-4014-46bb-bdde-0d40cc115cd6', 'c923e0be-f00a-4fd4-a951-4437dda0c4b0', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('a77cc9cf-7c2c-4fdf-94f4-5664bb21d8f6', 'c923e0be-f00a-4fd4-a951-4437dda0c4b0', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('32ec3bdb-1ad3-4da7-948f-bf1f34be49b5', '466afa32-c907-4f0d-8616-aa514394ebb1', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('adca9a3b-671c-4947-88c4-09fe2b067a54', '466afa32-c907-4f0d-8616-aa514394ebb1', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('619f3134-d198-48f3-8b66-87630fe0549a', 'ac40dc51-638f-4102-bf36-f8dfd747cddd', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('8ee29da6-507f-4002-95e3-def4baed982e', 'ac40dc51-638f-4102-bf36-f8dfd747cddd', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('33e69954-0059-4b18-804f-1c5caf34ab3d', 'a30daf52-e380-4796-872c-c7ebd2b4de04', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('4e79d2e4-3cd3-433c-bcf6-9618f49ea8ed', 'a30daf52-e380-4796-872c-c7ebd2b4de04', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('8e7b328a-84ea-4bdd-bd85-f980594427cb', 'c9dcbba3-acb1-454f-81b3-a1e7d00228b4', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('484fcbf4-6301-4cec-bd67-0e4dca970701', 'c9dcbba3-acb1-454f-81b3-a1e7d00228b4', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('6e40f7d5-3a13-450e-b632-a50e54c59e7c', '05b9f7ab-073b-47cd-83a0-5ed4f51411cc', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('88d0104c-f8f4-42b9-b306-07db03c931a2', '05b9f7ab-073b-47cd-83a0-5ed4f51411cc', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('5a067450-0739-4a97-b722-b6f09145dbfb', 'c205b35b-4026-427f-8718-b3bc127d9a67', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('d038d1ea-56e7-4bae-81df-515e8f9c3b9c', 'c205b35b-4026-427f-8718-b3bc127d9a67', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('f27938c7-edaf-40b8-900d-b7ebce10cafd', 'd1072722-8bcd-4151-842b-911d432b1377', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('6f561b6a-7048-435b-96e9-b04cfec83c4a', 'd1072722-8bcd-4151-842b-911d432b1377', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('4327f6b8-1845-42b4-a7c9-a41a247f0c3d', '475e248e-3fee-4e09-96fb-88315f3bf77c', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('7816d9e5-e0a7-4161-b797-1859f0e76156', '30b47626-273a-4c57-a13a-b0903a9c1375', 'Medium');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('10989ba3-c5bf-42ee-8fbe-712561ef9fe4', 'ded3fbe3-d584-48cb-9c9e-c37e87742c77', 'Large');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('9e8f61c3-adb8-46c7-86fa-9c5f253a8778', 'c239123c-59f6-49fa-bd2f-bf223d8e87d7', 'Small');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_size ("id", "item_id", "size") VALUES('e3e3492f-30c9-4f87-9983-4acf9443a919', '98388739-081d-4ef1-8e88-0eb5cf107b30', 'Medium');`,
      ]);
      console.log("populated inventory item sizes data");
    } catch (error) {
      console.log(
        "failed to insert inventory item sizes data in database, error: ",
        error
      );
    }
  }

  async insertInventoryItemImages() {
    try {
      const result =
        await prisma.$executeRaw`SELECT * FROM public.inventory_item_image LIMIT 1;`;

      if (result == 1) {
        console.log("data already exists for inventory item image table");
        return;
      }
    } catch (error) {
      console.log(
        "failed to query inventory item image table to verify records existence, error: ",
        error
      );
      return;
    }

    const projectPath = process.cwd();
    const queries = [
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('41c1b7a8-9e83-4a7b-abba-ac4cf94acce7', '555e3f63-f927-4b76-93cd-098ee5fbde4e', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0a85a584-cb49-4795-b2f1-7eebbf09399a.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('67e2ca72-e8ad-4402-b6d9-50b1aaa53d3a', '280f0550-5ac4-4f55-8777-6b46db6e27a3', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0a18630c-527b-4d56-9a98-8a0cfe341ab5.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('0344759a-d54d-420a-90b2-7070f52ae9cf', 'aec77d9e-c1d0-4678-82b2-60c6f33531ae', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0b546ee0-81f3-4d93-938d-34166d4194d7.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('ab443faf-fb6a-4d11-aafc-c417ec8059ee', '5fecd45a-016b-41b2-ae2c-4a74d878963d', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0d1df3d4-ad7f-43f8-9673-90d368f6c853.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('38b00c45-05d0-4723-9c60-a0e016f00a6b', '55d70f75-c9b3-46a0-a2b5-09e9bfe9830a', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0d87a812-8c30-4b1f-9ecc-199ae426c8e6.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('2a936558-8b22-4037-b7c3-66fe75b45b25', '2f97defc-964c-45b8-b8e4-5ce85892cd90', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0e3d71f8-7677-4cd4-ba24-4788c3890ac1.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('8480c036-f248-4d11-ab96-0640a96786b2', '01cb9f7b-3aa7-46bd-8bc2-31e82eecbbfc', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0c224954-0e0f-4caa-82c8-cf9581e89336.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('2faff527-3569-42a7-a85c-909f52fa2da3', 'e0f4d691-c624-4b6b-9896-3c451141eda3', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0ccc318a-7d69-4d7f-a442-aac1f88bc453.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('852326d6-7bd1-4f93-87b2-eb2461f9ba96', 'b53942ae-fd6b-4da0-83d5-db0a1dadc1c4', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0d0c2308-2c58-4e38-90c1-c893358b5f86.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('a5fe3092-5886-4cea-9a3c-e597e3f53394', 'd5e7f0e0-c6dd-4e50-b023-c18b4d5d5965', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/1a08f33a-2ff4-4fb8-920b-8ff514bcdda8.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('762abeb0-6a55-4556-bb44-8eac015b09ef', 'e68e6704-906b-4ac6-8349-be4032fe899e', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0a5d2669-3f7f-4350-9f1b-42204b0a9706.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('9a01f01e-0468-45ac-8706-f7479a8f7715', '6349f90e-a401-4f51-b124-c392c8faf2a1', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0a30baec-1938-47c5-b495-68a51701b43d.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('ce6465dc-fffd-467e-a128-de4abad3f678', '387b06d7-b5a4-4d51-9c30-226908d870a3', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0bacb2c4-3d90-4835-b23e-aa7c2284d1bc.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('8bdb6338-eb3e-48b9-8a06-997b2b5fe8ce', '64c88b4c-5d99-41bf-b523-cf92c61aa3d8', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0dd87e47-ca85-4d5c-9fd1-59f5a01eb656.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('c1323099-8eb8-4759-b7a1-63909906acec', '297e9cd4-73b1-4ad0-a8d8-8325c0de9a66', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0e6871ee-7246-48ad-a356-a7fdde9878d2.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('88c3edf7-5986-46cb-94b0-42215f83180f', '3d056ef8-11fb-40f0-8eeb-ff8e0d685a4b', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/2b3113c3-d37d-47f5-a784-20fb12228365.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('b566f40b-dd0e-4eeb-85cc-0dfbf805d909', 'ea599675-6d31-4467-b5a9-7799fe528971', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/2c923fb1-4bee-41dc-b393-973cd1a03bbf.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('f0785bf0-faa0-45f1-bb91-a358b56b7944', 'c940961e-f12e-476f-8076-a78634cf0d2b', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/2d39c5f2-3441-4c9d-8dc7-00b940fa64a3.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('c1b7d8e9-9bd9-49c1-baf2-6cad18b174d9', 'd62ede80-8792-43fb-9663-ed9058368fc4', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/2f96b4e8-3af7-4b3f-9488-69a51df7a917.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('5ebf3797-2828-4e81-bfe5-7d2076622b13', 'b6be0ae4-675d-4fec-a3d2-a1371a206ada', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/2e085c89-10fe-4a55-92fe-23acdb6d9990.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('558c1c0b-d689-490a-b087-908808a26402', 'f0dfaca7-7929-4b9e-b531-e644bcecc49d', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/00a1b7a8-217d-45bf-93a8-86db0bdf9d9d.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('615f5cc5-e385-4102-b84e-4bffb693d90e', '60cbc982-d143-4bad-a8e4-b6c458fe3efa', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0a86d893-93f1-4a52-8c42-07bb9f439833.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('57f65a5b-093d-4012-99a6-0db1490d7267', '49019296-1926-455b-82bb-ca2fc73b3c26', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0c6f89cd-30f6-4b44-bda5-0ba8d90e6717.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('bcd4dfd8-7e8b-488d-a7ca-1e08386941a2', '39f309eb-fa37-4db6-b72c-30c83a4ab8b8', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0d9f1bf9-0008-4247-b22b-832ab1c62a70.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('22a9f391-3576-401b-8243-5da5a8c70d3d', 'd56ef72f-37f5-42bb-b76a-fc12ab933570', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/1fe43e89-0e78-4667-881b-3feb27a63ce3.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('78cc3569-cc06-4298-96af-ca4dc22f1610', 'df94e0a0-fe85-42eb-9753-60e1b96fdafa', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0a69bc16-6adc-4563-8aa1-958c32f66524.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('9d4107c9-f33d-4eb2-8695-efc39e92aa8b', 'b20bbb23-2de3-4e11-9f03-e8eed8eee9d9', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0a1955a3-c4c5-4141-8a72-afbcf92d0dfa.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('593e8203-0c28-4712-b047-bf4451e4b34f', '2783d3ac-899d-478f-aeb3-4cefd99dcab9', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0e88c86f-911f-4dd6-85b6-cb953e9dd2c5.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('b2a7391f-365a-4ab1-9737-3cdad27aadde', '1da2694a-d6b2-4e6f-b3f1-50a6c58b0b47', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0ec67bba-c4e8-4446-86f5-23d7f6f26809.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('01e633ca-a79f-4776-8789-27bc1afc7ad3', '692ea4f4-93b9-4208-b768-0ca39d4523b8', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/0ed80b93-67c9-45bc-b16d-d926b79b9782.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('92db0ccc-31a4-452c-8b63-bbcaff2cf26c', '25d01f8e-b0d9-4121-8f50-fdc59fbb5637', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/1c0db814-f31c-42e6-a00c-0b18a819bef6.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('ed6169ce-247b-4108-8e73-336bd51c0b05', '5e81379f-8e8e-4e88-84c6-c212fa9868f6', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/4b46c02a-fd7c-4b39-8690-61da8e4396d1.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('83e33395-71bc-4209-839d-637289e4a493', '84173162-2246-4205-bf9c-7837fa02a54e', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/4d591b2d-59aa-4977-9f27-db69929cb9d8.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('cc7ccf07-1384-4f45-ac16-36fdb93a323a', 'a2f3e906-5d1e-4fa7-b442-8c6ac4d9a5b3', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/4d42474e-cc0c-4528-84ac-7a543ffa4ee2.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('7eb46b0e-f59f-41f8-ab06-14b7b429c0be', '85dd31bb-db8b-4a82-9cb1-922fd74592a5', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/4f242ce1-8493-408d-ae63-2422a7cdc21e.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('f14a7dbc-52e5-4100-aae4-424f4deef2a1', 'f8a1a80d-69be-4b89-82c2-46fb48449089', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/5b9d766d-0ad8-41e2-8a2e-2b1227e871dc.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('cdc5d2b9-6a34-4dca-b617-b244166582bd', '6cc4957d-463b-45bf-96da-d48ad61d0fbe', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/5d1f0cbe-702d-431a-92d0-246076af0028.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('6414ce52-c12c-49d7-84ce-d22691e41df1', '257a423a-1d30-4e0e-8487-ce9c2ed4509f', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/005d3a4d-b8cc-4f14-a288-8065ab797974.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('d73f7d85-3445-40a3-917f-f2077596d2a4', 'da976b65-950d-496e-be8d-746c3e01de57', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/5ec1221f-a52f-4602-9c2c-ed4c81a26708.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('c12fd298-399e-4c7a-9820-c4b9c8c89b62', 'c13a045f-7c50-4b86-9bf4-f89df5a2e053', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/8de3baf1-0422-4f6c-beca-6ace1f0b8730.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('cdc13fb7-c2d4-4099-b258-fbd322dd0548', '4187174c-7294-4de9-ae18-e28bb00582b5', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/8e8547e9-0c95-4c22-a5de-4a2b096ca6c0.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('9ee8248a-dad4-49b1-9282-2963abfc0fda', '471c7067-5437-4a0d-8e1a-480e78c4618f', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/8f82b258-95ed-447e-b912-7b906c931d88.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('67a3cefd-53ee-4ece-83ac-3996b26ef937', 'fbaa0774-436d-4e0b-a3fc-a7d7923e6819', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/9bd47c09-cd05-4d03-8968-5ad91ed24a2b.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('266a2553-06ab-47e0-922c-cfe52b3767c5', '531b432b-a899-4a06-a81c-ad5650f4a703', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/9bf98990-7cb9-4224-8039-481b9cd3df08.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('ce9ffa2a-7d13-4068-aee7-50f2f72f76bc', 'c2f7a27f-8455-4833-afa0-b880db6101ac', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/9c34e9c0-a3f7-4351-a850-0b23fb6d0756.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('afdcda52-b292-4b42-9d91-4853308b6166', 'cfff7483-079c-46fa-a804-a459f03f81ae', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/f82c1af3-04c0-45c8-af77-c0cf2b04b0da.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('bea48641-24f5-44a0-ac87-d14a42f990f3', 'a27e461d-a248-4a57-964d-9923e351d26b', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/f1cf862d-a02a-4c64-a0e6-73eb80aad5a1.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('b4d07109-d9e7-4852-b01f-be06f17ce4bb', 'e3890a02-40ce-45c6-bb1d-7bee8ca3f980', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/e2d5c118-6989-4682-b822-3171074af425.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('172f105e-8555-4acf-bae5-1c29e8311198', '3119fcba-bd61-4696-b437-3e78b9bdcc2f', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/e0f4be43-6426-482b-8747-0a22d3c16d16.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('efcc3dda-e63b-40d8-a838-062173e91184', '18870d09-8f61-47de-953e-c45280bb207f', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/de484f70-c1ef-4f66-9435-8ac433940881.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('54dd47b3-1beb-4fb3-9edc-65ddb9ed92db', '9fca9bf9-71d0-41cb-a354-730c3306587b', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/ff7d4f3b-a8ef-414e-a1ac-8b9527264f5b.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('db806b46-4841-470e-b7ed-0da05ccd318e', '2a481ceb-010a-4768-9974-e88cbc5d86c3', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/fe7ca6a3-50a8-4377-9e67-a80652d1594a.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('f0053018-d5cd-4df4-a2e7-9872cb25b15e', '4827f428-b0bc-4b15-a18e-cbe6f8d40e6a', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/fd28f175-6ac7-4506-b67b-ae1bcbfc5c61.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('1232690c-3263-4e9b-85a3-1fc20126066b', 'e85ade88-d8f7-414a-b569-18d0eec320d1', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/fcd12553-82a2-4235-9695-438e001a531e.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('00303ae5-8c6e-40bf-bd58-20fb8bf1d879', 'c560b662-226b-4569-930e-69077c8cc130', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/fc33993c-6696-4a4e-be6a-dc6f5c08eb09.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('150bdadc-b197-4d2d-9383-c1ddeaf8be32', 'fbf50560-2155-40f3-8a1f-fbf794668384', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/fc445dc0-d718-4478-845f-a0223a74ebb8.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('e4767896-fee4-49c9-b7de-44d07356d05f', '6f6054aa-8653-46c1-8742-94d0d8923b60', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/fbdcc9a6-1363-46a5-8df7-1cfd715420c3.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('cccd44ba-a9b9-4905-a520-f1949177f65e', '42beb4bd-0096-4063-b726-93e42f8fdd7e', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/fc2c397f-29cb-4524-b797-5bda35da7d18.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('b1e10a78-bacd-4701-a7e9-4bfbf0b21569', '423727a3-23fb-4188-914f-04f2cdea7ad7', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/fc5685b3-5fb1-40ae-9fae-926bac491f65.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('8437fbe4-2930-4037-a173-7047412090f7', 'c8749cbe-f3f7-48ad-8b06-d4e97850b999', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/fca6b5f0-8fd2-446a-a226-117d395f7c9d.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('2f3c2346-403d-4ff9-9ecd-3bf822309f5b', '00380cd6-754c-4cc5-9d04-1a08d74eff6a', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/fab99089-ea1a-4380-988a-e700bbe73d42.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('76c9f406-fc7d-4a3f-87b7-108e72ef9e5e', 'f5531195-fb71-48ba-a347-71e39e08c212', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/f6e6c873-3e0e-4048-8ebb-7ce712f37800.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('ab855240-a386-459c-a6fe-de3f1c344a0c', 'c923e0be-f00a-4fd4-a951-4437dda0c4b0', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/ebec15e9-eeb6-4d98-bcb1-f50db1d50616.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('64d60fd6-5f43-444a-99ef-dd74ac5839eb', '466afa32-c907-4f0d-8616-aa514394ebb1', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/e804cef6-5d03-443a-92ee-986586210252.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('ce777722-51f9-483a-845a-b2ad7049b7da', 'ac40dc51-638f-4102-bf36-f8dfd747cddd', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/e98f1185-29fd-42e9-9fde-f0ee5140ad6a.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('b60af4c0-416a-4e21-863f-7ff501cc79a3', 'a30daf52-e380-4796-872c-c7ebd2b4de04', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/dcc9ba78-0c23-47aa-8c87-f3285a5cb5f8.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('bd11afdf-8c3d-4bd0-bcc9-a6977fd21716', 'c9dcbba3-acb1-454f-81b3-a1e7d00228b4', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/da6ea957-4f8f-4f69-92de-52586e4a79c8.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('03a8152b-b1ea-45cd-9c16-78a9cf1a3e07', '05b9f7ab-073b-47cd-83a0-5ed4f51411cc', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/d01ab2c4-493b-4071-a2fa-8e305415728a.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('b8adcbbb-76bd-4da6-8f57-2f76d4c8d8ea', 'c205b35b-4026-427f-8718-b3bc127d9a67', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/ce02970e-c19b-42a4-ab4c-b868af097412.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('693c9f98-2aba-4ac6-97e8-2faebfe2118c', 'd1072722-8bcd-4151-842b-911d432b1377', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/b1da2943-f33f-451d-ac26-2913d88d25c1.jpg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('c1ffd1bc-ffaf-4d28-8882-cb8d70ad3c6a', '475e248e-3fee-4e09-96fb-88315f3bf77c', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/image9.jpeg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('e9631a47-a813-4b32-bf8e-040612fc4fa7', '30b47626-273a-4c57-a13a-b0903a9c1375', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/image10.jpeg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('b4aaddd7-a334-48b7-82f8-1ad7e3954dbd', 'ded3fbe3-d584-48cb-9c9e-c37e87742c77', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/image11.jpeg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('2b75b189-f071-424d-8df2-597024d7394b', 'c239123c-59f6-49fa-bd2f-bf223d8e87d7', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/image13.jpeg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
      `INSERT INTO public.inventory_item_image("id", "item_id", "image", "created_at", "modified_at") VALUES('da255399-e7ef-4be4-a2ef-5d2f65887193', '98388739-081d-4ef1-8e88-0eb5cf107b30', pg_read_binary_file('${projectPath}/database_setup/schema_statements/inventory/images/image12.jpeg'), '2024-06-08T23:55:17+05:00', '2024-06-08T23:55:17+05:00');`,
    ];

    for (var i = 0; i < queries.length; i++) {
      try {
        await prisma.$executeRawUnsafe(queries[i]);
      } catch (error) {
        console.log(
          "failed to insert inventory item images data in database, error: ",
          error
        );
        return;
      }
    }
    console.log("populated inventory item images data");
  }

  async insertInventoryItemImagesURL() {
    try {
      const result =
        await prisma.$executeRaw`SELECT * FROM public.inventory_item_image_url LIMIT 1;`;

      if (result == 1) {
        console.log("data already exists for inventory item image URL table");
        return;
      }
    } catch (error) {
      console.log(
        "failed to query inventory item image URL table to verify records existence, error: ",
        error
      );
      return;
    }

    try {
      await prisma.$transaction([
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('41c1b7a8-9e83-4a7b-abba-ac4cf94acce7', '555e3f63-f927-4b76-93cd-098ee5fbde4e', '/itemImage/555e3f63-f927-4b76-93cd-098ee5fbde4e/41c1b7a8-9e83-4a7b-abba-ac4cf94acce7');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('67e2ca72-e8ad-4402-b6d9-50b1aaa53d3a', '280f0550-5ac4-4f55-8777-6b46db6e27a3', '/itemImage/280f0550-5ac4-4f55-8777-6b46db6e27a3/67e2ca72-e8ad-4402-b6d9-50b1aaa53d3a');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('0344759a-d54d-420a-90b2-7070f52ae9cf', 'aec77d9e-c1d0-4678-82b2-60c6f33531ae', '/itemImage/aec77d9e-c1d0-4678-82b2-60c6f33531ae/0344759a-d54d-420a-90b2-7070f52ae9cf');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('ab443faf-fb6a-4d11-aafc-c417ec8059ee', '5fecd45a-016b-41b2-ae2c-4a74d878963d', '/itemImage/5fecd45a-016b-41b2-ae2c-4a74d878963d/ab443faf-fb6a-4d11-aafc-c417ec8059ee');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('38b00c45-05d0-4723-9c60-a0e016f00a6b', '55d70f75-c9b3-46a0-a2b5-09e9bfe9830a', '/itemImage/55d70f75-c9b3-46a0-a2b5-09e9bfe9830a/38b00c45-05d0-4723-9c60-a0e016f00a6b');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('2a936558-8b22-4037-b7c3-66fe75b45b25', '2f97defc-964c-45b8-b8e4-5ce85892cd90', '/itemImage/2f97defc-964c-45b8-b8e4-5ce85892cd90/2a936558-8b22-4037-b7c3-66fe75b45b25');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('8480c036-f248-4d11-ab96-0640a96786b2', '01cb9f7b-3aa7-46bd-8bc2-31e82eecbbfc', '/itemImage/01cb9f7b-3aa7-46bd-8bc2-31e82eecbbfc/8480c036-f248-4d11-ab96-0640a96786b2');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('2faff527-3569-42a7-a85c-909f52fa2da3', 'e0f4d691-c624-4b6b-9896-3c451141eda3', '/itemImage/e0f4d691-c624-4b6b-9896-3c451141eda3/2faff527-3569-42a7-a85c-909f52fa2da3');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('852326d6-7bd1-4f93-87b2-eb2461f9ba96', 'b53942ae-fd6b-4da0-83d5-db0a1dadc1c4', '/itemImage/b53942ae-fd6b-4da0-83d5-db0a1dadc1c4/852326d6-7bd1-4f93-87b2-eb2461f9ba96');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('a5fe3092-5886-4cea-9a3c-e597e3f53394', 'd5e7f0e0-c6dd-4e50-b023-c18b4d5d5965', '/itemImage/d5e7f0e0-c6dd-4e50-b023-c18b4d5d5965/a5fe3092-5886-4cea-9a3c-e597e3f53394');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('762abeb0-6a55-4556-bb44-8eac015b09ef', 'e68e6704-906b-4ac6-8349-be4032fe899e', '/itemImage/e68e6704-906b-4ac6-8349-be4032fe899e/762abeb0-6a55-4556-bb44-8eac015b09ef');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('9a01f01e-0468-45ac-8706-f7479a8f7715', '6349f90e-a401-4f51-b124-c392c8faf2a1', '/itemImage/6349f90e-a401-4f51-b124-c392c8faf2a1/9a01f01e-0468-45ac-8706-f7479a8f7715');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('ce6465dc-fffd-467e-a128-de4abad3f678', '387b06d7-b5a4-4d51-9c30-226908d870a3', '/itemImage/387b06d7-b5a4-4d51-9c30-226908d870a3/ce6465dc-fffd-467e-a128-de4abad3f678');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('8bdb6338-eb3e-48b9-8a06-997b2b5fe8ce', '64c88b4c-5d99-41bf-b523-cf92c61aa3d8', '/itemImage/64c88b4c-5d99-41bf-b523-cf92c61aa3d8/8bdb6338-eb3e-48b9-8a06-997b2b5fe8ce');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('c1323099-8eb8-4759-b7a1-63909906acec', '297e9cd4-73b1-4ad0-a8d8-8325c0de9a66', '/itemImage/297e9cd4-73b1-4ad0-a8d8-8325c0de9a66/c1323099-8eb8-4759-b7a1-63909906acec');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('88c3edf7-5986-46cb-94b0-42215f83180f', '3d056ef8-11fb-40f0-8eeb-ff8e0d685a4b', '/itemImage/3d056ef8-11fb-40f0-8eeb-ff8e0d685a4b/88c3edf7-5986-46cb-94b0-42215f83180f');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('b566f40b-dd0e-4eeb-85cc-0dfbf805d909', 'ea599675-6d31-4467-b5a9-7799fe528971', '/itemImage/ea599675-6d31-4467-b5a9-7799fe528971/b566f40b-dd0e-4eeb-85cc-0dfbf805d909');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('f0785bf0-faa0-45f1-bb91-a358b56b7944', 'c940961e-f12e-476f-8076-a78634cf0d2b', '/itemImage/c940961e-f12e-476f-8076-a78634cf0d2b/f0785bf0-faa0-45f1-bb91-a358b56b7944');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('c1b7d8e9-9bd9-49c1-baf2-6cad18b174d9', 'd62ede80-8792-43fb-9663-ed9058368fc4', '/itemImage/d62ede80-8792-43fb-9663-ed9058368fc4/c1b7d8e9-9bd9-49c1-baf2-6cad18b174d9');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('5ebf3797-2828-4e81-bfe5-7d2076622b13', 'b6be0ae4-675d-4fec-a3d2-a1371a206ada', '/itemImage/b6be0ae4-675d-4fec-a3d2-a1371a206ada/5ebf3797-2828-4e81-bfe5-7d2076622b13');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('558c1c0b-d689-490a-b087-908808a26402', 'f0dfaca7-7929-4b9e-b531-e644bcecc49d', '/itemImage/f0dfaca7-7929-4b9e-b531-e644bcecc49d/558c1c0b-d689-490a-b087-908808a26402');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('615f5cc5-e385-4102-b84e-4bffb693d90e', '60cbc982-d143-4bad-a8e4-b6c458fe3efa', '/itemImage/60cbc982-d143-4bad-a8e4-b6c458fe3efa/615f5cc5-e385-4102-b84e-4bffb693d90e');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('57f65a5b-093d-4012-99a6-0db1490d7267', '49019296-1926-455b-82bb-ca2fc73b3c26', '/itemImage/49019296-1926-455b-82bb-ca2fc73b3c26/57f65a5b-093d-4012-99a6-0db1490d7267');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('bcd4dfd8-7e8b-488d-a7ca-1e08386941a2', '39f309eb-fa37-4db6-b72c-30c83a4ab8b8', '/itemImage/39f309eb-fa37-4db6-b72c-30c83a4ab8b8/bcd4dfd8-7e8b-488d-a7ca-1e08386941a2');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('22a9f391-3576-401b-8243-5da5a8c70d3d', 'd56ef72f-37f5-42bb-b76a-fc12ab933570', '/itemImage/d56ef72f-37f5-42bb-b76a-fc12ab933570/22a9f391-3576-401b-8243-5da5a8c70d3d');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('78cc3569-cc06-4298-96af-ca4dc22f1610', 'df94e0a0-fe85-42eb-9753-60e1b96fdafa', '/itemImage/df94e0a0-fe85-42eb-9753-60e1b96fdafa/78cc3569-cc06-4298-96af-ca4dc22f1610');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('9d4107c9-f33d-4eb2-8695-efc39e92aa8b', 'b20bbb23-2de3-4e11-9f03-e8eed8eee9d9', '/itemImage/b20bbb23-2de3-4e11-9f03-e8eed8eee9d9/9d4107c9-f33d-4eb2-8695-efc39e92aa8b');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('593e8203-0c28-4712-b047-bf4451e4b34f', '2783d3ac-899d-478f-aeb3-4cefd99dcab9', '/itemImage/2783d3ac-899d-478f-aeb3-4cefd99dcab9/593e8203-0c28-4712-b047-bf4451e4b34f');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('b2a7391f-365a-4ab1-9737-3cdad27aadde', '1da2694a-d6b2-4e6f-b3f1-50a6c58b0b47', '/itemImage/1da2694a-d6b2-4e6f-b3f1-50a6c58b0b47/b2a7391f-365a-4ab1-9737-3cdad27aadde');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('01e633ca-a79f-4776-8789-27bc1afc7ad3', '692ea4f4-93b9-4208-b768-0ca39d4523b8', '/itemImage/692ea4f4-93b9-4208-b768-0ca39d4523b8/01e633ca-a79f-4776-8789-27bc1afc7ad3');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('92db0ccc-31a4-452c-8b63-bbcaff2cf26c', '25d01f8e-b0d9-4121-8f50-fdc59fbb5637', '/itemImage/25d01f8e-b0d9-4121-8f50-fdc59fbb5637/92db0ccc-31a4-452c-8b63-bbcaff2cf26c');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('ed6169ce-247b-4108-8e73-336bd51c0b05', '5e81379f-8e8e-4e88-84c6-c212fa9868f6', '/itemImage/5e81379f-8e8e-4e88-84c6-c212fa9868f6/ed6169ce-247b-4108-8e73-336bd51c0b05');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('83e33395-71bc-4209-839d-637289e4a493', '84173162-2246-4205-bf9c-7837fa02a54e', '/itemImage/84173162-2246-4205-bf9c-7837fa02a54e/83e33395-71bc-4209-839d-637289e4a493');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('cc7ccf07-1384-4f45-ac16-36fdb93a323a', 'a2f3e906-5d1e-4fa7-b442-8c6ac4d9a5b3', '/itemImage/a2f3e906-5d1e-4fa7-b442-8c6ac4d9a5b3/cc7ccf07-1384-4f45-ac16-36fdb93a323a');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('7eb46b0e-f59f-41f8-ab06-14b7b429c0be', '85dd31bb-db8b-4a82-9cb1-922fd74592a5', '/itemImage/85dd31bb-db8b-4a82-9cb1-922fd74592a5/7eb46b0e-f59f-41f8-ab06-14b7b429c0be');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('f14a7dbc-52e5-4100-aae4-424f4deef2a1', 'f8a1a80d-69be-4b89-82c2-46fb48449089', '/itemImage/f8a1a80d-69be-4b89-82c2-46fb48449089/f14a7dbc-52e5-4100-aae4-424f4deef2a1');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('cdc5d2b9-6a34-4dca-b617-b244166582bd', '6cc4957d-463b-45bf-96da-d48ad61d0fbe', '/itemImage/6cc4957d-463b-45bf-96da-d48ad61d0fbe/cdc5d2b9-6a34-4dca-b617-b244166582bd');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('6414ce52-c12c-49d7-84ce-d22691e41df1', '257a423a-1d30-4e0e-8487-ce9c2ed4509f', '/itemImage/257a423a-1d30-4e0e-8487-ce9c2ed4509f/6414ce52-c12c-49d7-84ce-d22691e41df1');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('d73f7d85-3445-40a3-917f-f2077596d2a4', 'da976b65-950d-496e-be8d-746c3e01de57', '/itemImage/da976b65-950d-496e-be8d-746c3e01de57/d73f7d85-3445-40a3-917f-f2077596d2a4');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('c12fd298-399e-4c7a-9820-c4b9c8c89b62', 'c13a045f-7c50-4b86-9bf4-f89df5a2e053', '/itemImage/c13a045f-7c50-4b86-9bf4-f89df5a2e053/c12fd298-399e-4c7a-9820-c4b9c8c89b62');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('cdc13fb7-c2d4-4099-b258-fbd322dd0548', '4187174c-7294-4de9-ae18-e28bb00582b5', '/itemImage/4187174c-7294-4de9-ae18-e28bb00582b5/cdc13fb7-c2d4-4099-b258-fbd322dd0548');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('9ee8248a-dad4-49b1-9282-2963abfc0fda', '471c7067-5437-4a0d-8e1a-480e78c4618f', '/itemImage/471c7067-5437-4a0d-8e1a-480e78c4618f/9ee8248a-dad4-49b1-9282-2963abfc0fda');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('67a3cefd-53ee-4ece-83ac-3996b26ef937', 'fbaa0774-436d-4e0b-a3fc-a7d7923e6819', '/itemImage/fbaa0774-436d-4e0b-a3fc-a7d7923e6819/67a3cefd-53ee-4ece-83ac-3996b26ef937');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('266a2553-06ab-47e0-922c-cfe52b3767c5', '531b432b-a899-4a06-a81c-ad5650f4a703', '/itemImage/531b432b-a899-4a06-a81c-ad5650f4a703/266a2553-06ab-47e0-922c-cfe52b3767c5');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('ce9ffa2a-7d13-4068-aee7-50f2f72f76bc', 'c2f7a27f-8455-4833-afa0-b880db6101ac', '/itemImage/c2f7a27f-8455-4833-afa0-b880db6101ac/ce9ffa2a-7d13-4068-aee7-50f2f72f76bc');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('afdcda52-b292-4b42-9d91-4853308b6166', 'cfff7483-079c-46fa-a804-a459f03f81ae', '/itemImage/cfff7483-079c-46fa-a804-a459f03f81ae/afdcda52-b292-4b42-9d91-4853308b6166');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('bea48641-24f5-44a0-ac87-d14a42f990f3', 'a27e461d-a248-4a57-964d-9923e351d26b', '/itemImage/a27e461d-a248-4a57-964d-9923e351d26b/bea48641-24f5-44a0-ac87-d14a42f990f3');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('b4d07109-d9e7-4852-b01f-be06f17ce4bb', 'e3890a02-40ce-45c6-bb1d-7bee8ca3f980', '/itemImage/e3890a02-40ce-45c6-bb1d-7bee8ca3f980/b4d07109-d9e7-4852-b01f-be06f17ce4bb');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('172f105e-8555-4acf-bae5-1c29e8311198', '3119fcba-bd61-4696-b437-3e78b9bdcc2f', '/itemImage/3119fcba-bd61-4696-b437-3e78b9bdcc2f/172f105e-8555-4acf-bae5-1c29e8311198');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('efcc3dda-e63b-40d8-a838-062173e91184', '18870d09-8f61-47de-953e-c45280bb207f', '/itemImage/18870d09-8f61-47de-953e-c45280bb207f/efcc3dda-e63b-40d8-a838-062173e91184');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('54dd47b3-1beb-4fb3-9edc-65ddb9ed92db', '9fca9bf9-71d0-41cb-a354-730c3306587b', '/itemImage/9fca9bf9-71d0-41cb-a354-730c3306587b/54dd47b3-1beb-4fb3-9edc-65ddb9ed92db');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('db806b46-4841-470e-b7ed-0da05ccd318e', '2a481ceb-010a-4768-9974-e88cbc5d86c3', '/itemImage/2a481ceb-010a-4768-9974-e88cbc5d86c3/db806b46-4841-470e-b7ed-0da05ccd318e');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('f0053018-d5cd-4df4-a2e7-9872cb25b15e', '4827f428-b0bc-4b15-a18e-cbe6f8d40e6a', '/itemImage/4827f428-b0bc-4b15-a18e-cbe6f8d40e6a/f0053018-d5cd-4df4-a2e7-9872cb25b15e');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('1232690c-3263-4e9b-85a3-1fc20126066b', 'e85ade88-d8f7-414a-b569-18d0eec320d1', '/itemImage/e85ade88-d8f7-414a-b569-18d0eec320d1/1232690c-3263-4e9b-85a3-1fc20126066b');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('00303ae5-8c6e-40bf-bd58-20fb8bf1d879', 'c560b662-226b-4569-930e-69077c8cc130', '/itemImage/c560b662-226b-4569-930e-69077c8cc130/00303ae5-8c6e-40bf-bd58-20fb8bf1d879');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('150bdadc-b197-4d2d-9383-c1ddeaf8be32', 'fbf50560-2155-40f3-8a1f-fbf794668384', '/itemImage/fbf50560-2155-40f3-8a1f-fbf794668384/150bdadc-b197-4d2d-9383-c1ddeaf8be32');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('e4767896-fee4-49c9-b7de-44d07356d05f', '6f6054aa-8653-46c1-8742-94d0d8923b60', '/itemImage/6f6054aa-8653-46c1-8742-94d0d8923b60/e4767896-fee4-49c9-b7de-44d07356d05f');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('cccd44ba-a9b9-4905-a520-f1949177f65e', '42beb4bd-0096-4063-b726-93e42f8fdd7e', '/itemImage/42beb4bd-0096-4063-b726-93e42f8fdd7e/cccd44ba-a9b9-4905-a520-f1949177f65e');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('b1e10a78-bacd-4701-a7e9-4bfbf0b21569', '423727a3-23fb-4188-914f-04f2cdea7ad7', '/itemImage/423727a3-23fb-4188-914f-04f2cdea7ad7/b1e10a78-bacd-4701-a7e9-4bfbf0b21569');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('8437fbe4-2930-4037-a173-7047412090f7', 'c8749cbe-f3f7-48ad-8b06-d4e97850b999', '/itemImage/c8749cbe-f3f7-48ad-8b06-d4e97850b999/8437fbe4-2930-4037-a173-7047412090f7');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('2f3c2346-403d-4ff9-9ecd-3bf822309f5b', '00380cd6-754c-4cc5-9d04-1a08d74eff6a', '/itemImage/00380cd6-754c-4cc5-9d04-1a08d74eff6a/2f3c2346-403d-4ff9-9ecd-3bf822309f5b');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('76c9f406-fc7d-4a3f-87b7-108e72ef9e5e', 'f5531195-fb71-48ba-a347-71e39e08c212', '/itemImage/f5531195-fb71-48ba-a347-71e39e08c212/76c9f406-fc7d-4a3f-87b7-108e72ef9e5e');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('ab855240-a386-459c-a6fe-de3f1c344a0c', 'c923e0be-f00a-4fd4-a951-4437dda0c4b0', '/itemImage/c923e0be-f00a-4fd4-a951-4437dda0c4b0/ab855240-a386-459c-a6fe-de3f1c344a0c');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('64d60fd6-5f43-444a-99ef-dd74ac5839eb', '466afa32-c907-4f0d-8616-aa514394ebb1', '/itemImage/466afa32-c907-4f0d-8616-aa514394ebb1/64d60fd6-5f43-444a-99ef-dd74ac5839eb');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('ce777722-51f9-483a-845a-b2ad7049b7da', 'ac40dc51-638f-4102-bf36-f8dfd747cddd', '/itemImage/ac40dc51-638f-4102-bf36-f8dfd747cddd/ce777722-51f9-483a-845a-b2ad7049b7da');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('b60af4c0-416a-4e21-863f-7ff501cc79a3', 'a30daf52-e380-4796-872c-c7ebd2b4de04', '/itemImage/a30daf52-e380-4796-872c-c7ebd2b4de04/b60af4c0-416a-4e21-863f-7ff501cc79a3');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('bd11afdf-8c3d-4bd0-bcc9-a6977fd21716', 'c9dcbba3-acb1-454f-81b3-a1e7d00228b4', '/itemImage/c9dcbba3-acb1-454f-81b3-a1e7d00228b4/bd11afdf-8c3d-4bd0-bcc9-a6977fd21716');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('03a8152b-b1ea-45cd-9c16-78a9cf1a3e07', '05b9f7ab-073b-47cd-83a0-5ed4f51411cc', '/itemImage/05b9f7ab-073b-47cd-83a0-5ed4f51411cc/03a8152b-b1ea-45cd-9c16-78a9cf1a3e07');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('b8adcbbb-76bd-4da6-8f57-2f76d4c8d8ea', 'c205b35b-4026-427f-8718-b3bc127d9a67', '/itemImage/c205b35b-4026-427f-8718-b3bc127d9a67/b8adcbbb-76bd-4da6-8f57-2f76d4c8d8ea');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('693c9f98-2aba-4ac6-97e8-2faebfe2118c', 'd1072722-8bcd-4151-842b-911d432b1377', '/itemImage/d1072722-8bcd-4151-842b-911d432b1377/693c9f98-2aba-4ac6-97e8-2faebfe2118c');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('c1ffd1bc-ffaf-4d28-8882-cb8d70ad3c6a', '475e248e-3fee-4e09-96fb-88315f3bf77c', '/itemImage/475e248e-3fee-4e09-96fb-88315f3bf77c/c1ffd1bc-ffaf-4d28-8882-cb8d70ad3c6a');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('e9631a47-a813-4b32-bf8e-040612fc4fa7', '30b47626-273a-4c57-a13a-b0903a9c1375', '/itemImage/30b47626-273a-4c57-a13a-b0903a9c1375/e9631a47-a813-4b32-bf8e-040612fc4fa7');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('b4aaddd7-a334-48b7-82f8-1ad7e3954dbd', 'ded3fbe3-d584-48cb-9c9e-c37e87742c77', '/itemImage/ded3fbe3-d584-48cb-9c9e-c37e87742c77/b4aaddd7-a334-48b7-82f8-1ad7e3954dbd');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('2b75b189-f071-424d-8df2-597024d7394b', 'c239123c-59f6-49fa-bd2f-bf223d8e87d7', '/itemImage/c239123c-59f6-49fa-bd2f-bf223d8e87d7/2b75b189-f071-424d-8df2-597024d7394b');`,
        prisma.$executeRaw`INSERT INTO public.inventory_item_image_url(id, item_id, image_url) VALUES('da255399-e7ef-4be4-a2ef-5d2f65887193', '98388739-081d-4ef1-8e88-0eb5cf107b30', '/itemImage/98388739-081d-4ef1-8e88-0eb5cf107b30/da255399-e7ef-4be4-a2ef-5d2f65887193');`,
      ]);
      console.log("populated inventory item images URL data");
    } catch (error) {
      console.log(
        "failed to insert inventory item images URL data in database, error: ",
        error
      );
    }
  }
}

// Run the script
const populateData = new PopulateData();
populateData.insertData()
  .then(() => {
    console.log("Data population completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Data population failed:", error);
    process.exit(1);
  });
