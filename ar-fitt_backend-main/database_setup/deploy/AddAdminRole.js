import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import { buildPrismaClient } from "../../infra/db/prismaClient.js";
import { hashPassword } from "../../middleware/crypto/passwordHashing.js";

const prisma = buildPrismaClient();

export class AddAdminRole {
  async createAdminUser() {
    try {
      console.log("Creating admin user...");
      
      // Check if admin user already exists
      const existingAdmin = await prisma.user.findFirst({
        where: {
          email: "admin@arfitt.com"
        }
      });

      if (existingAdmin) {
        // Update existing user to admin role
        await prisma.user.update({
          where: { id: existingAdmin.id },
          data: { role: "admin" }
        });
        
        // Check if credentials exist, if not create them
        const existingCreds = await prisma.user_credential.findUnique({
          where: { user_email: "admin@arfitt.com" }
        });
        
        if (!existingCreds) {
          const hashedPassword = await hashPassword("admin123");
          await prisma.user_credential.create({
            data: {
              user_email: "admin@arfitt.com",
              password_hash: hashedPassword,
              created_at: new Date(),
              modified_at: new Date()
            }
          });
          console.log("Admin credentials created!");
        } else {
          // Update existing credentials with correct hash
          const hashedPassword = await hashPassword("admin123");
          await prisma.user_credential.update({
            where: { user_email: "admin@arfitt.com" },
            data: {
              password_hash: hashedPassword,
              modified_at: new Date()
            }
          });
          console.log("Admin credentials updated!");
        }
        
        console.log("Existing user updated to admin role!");
        return true;
      }

      // Create new admin user
      const adminUser = await prisma.user.create({
        data: {
          id: uuidv4(),
          email: "admin@arfitt.com",
          first_name: "Admin",
          last_name: "User",
          phone: "123-456-7890",
          gender: "male",
          dob: new Date("1990-01-01"),
          is_verified: true,
          is_subscribed: true,
          is_body_scanned: false,
          is_face_scanned: false,
          created_at: new Date(),
          modified_at: new Date(),
          role: "admin"
        }
      });

      // Create admin credentials
      const hashedPassword = await hashPassword("admin123");
      await prisma.user_credential.create({
        data: {
          user_email: "admin@arfitt.com",
          password_hash: hashedPassword,
          created_at: new Date(),
          modified_at: new Date()
        }
      });

      console.log("Admin user created successfully!");
      console.log("Admin email: admin@arfitt.com");
      console.log("Admin password: admin123");
      console.log("Admin ID:", adminUser.id);
      
      return true;
    } catch (error) {
      console.error("Error creating admin user:", error);
      return false;
    }
  }

  async execute() {
    console.log("Starting admin role setup...");

    const adminCreated = await this.createAdminUser();
    if (!adminCreated) {
      console.error("Failed to create admin user");
      return;
    }

    console.log("Admin role setup completed successfully!");
  }
}

// Run the script
const addAdminRole = new AddAdminRole();
addAdminRole.execute()
  .then(() => {
    console.log("Setup completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Setup failed:", error);
    process.exit(1);
  });
