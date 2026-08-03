-- CreateTable
CREATE TABLE "email_verification" (
    "verification_id" SERIAL NOT NULL,
    "token_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "email_verification_pkey" PRIMARY KEY ("verification_id")
);

-- AddForeignKey
ALTER TABLE "email_verification" ADD CONSTRAINT "email_verification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
