-- CreateTable
CREATE TABLE "recover_password" (
    "recover_id" SERIAL NOT NULL,
    "code_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "recover_password_pkey" PRIMARY KEY ("recover_id")
);

-- AddForeignKey
ALTER TABLE "recover_password" ADD CONSTRAINT "recover_password_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
