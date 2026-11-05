-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    "gender" TEXT NOT NULL,
    "dob" DATE NOT NULL,
    "is_verified" BOOLEAN NOT NULL,
    "is_subscribed" BOOLEAN NOT NULL,
    "is_body_scanned" BOOLEAN NOT NULL,
    "is_face_scanned" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_body_matrix" (
    "user_id" TEXT NOT NULL,
    "body_matrix" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_body_matrix_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_face_matrix" (
    "user_id" TEXT NOT NULL,
    "face_matrix" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_face_matrix_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_body_image" (
    "user_id" TEXT NOT NULL,
    "body_image" TEXT NOT NULL,
    "recommended_size" TEXT NOT NULL,
    "recommended_colors" TEXT NOT NULL,
    "recommended_shirts" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "modified_at" TIMESTAMP(3),

    CONSTRAINT "user_body_image_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_face_image" (
    "user_id" TEXT NOT NULL,
    "face_image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_face_image_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_credential" (
    "user_email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_credential_pkey" PRIMARY KEY ("user_email")
);

-- CreateTable
CREATE TABLE "user_subscription" (
    "user_id" TEXT NOT NULL,
    "subscription_plan_id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_subscription_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "payment_service_user" (
    "user_id" TEXT NOT NULL,
    "payment_service_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_service_user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "inventory_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_item" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "description" TEXT,
    "lens_id" TEXT NOT NULL,
    "gender" TEXT,

    CONSTRAINT "inventory_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_item_color" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "color_hex" TEXT NOT NULL,

    CONSTRAINT "inventory_item_color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_item_size" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "size" TEXT NOT NULL,

    CONSTRAINT "inventory_item_size_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_item_image_url" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "inventory_item_image_url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_item_image" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "image" BYTEA NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_item_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_demo_item" (
    "item_id" TEXT NOT NULL,
    "is_demo_item" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_demo_item_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "inventory_demo_category" (
    "category_id" TEXT NOT NULL,
    "is_demo_item" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_demo_category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "user_otp" (
    "id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "otp_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "inventory_item" ADD CONSTRAINT "inventory_item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "inventory_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item_color" ADD CONSTRAINT "inventory_item_color_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item_size" ADD CONSTRAINT "inventory_item_size_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item_image_url" ADD CONSTRAINT "inventory_item_image_url_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item_image" ADD CONSTRAINT "inventory_item_image_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
