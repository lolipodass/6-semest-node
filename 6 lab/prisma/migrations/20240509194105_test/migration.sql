BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000),
    [password] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [Users_role_df] DEFAULT 'user',
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Users_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[Repos] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000),
    [authorId] INT NOT NULL,
    CONSTRAINT [Repos_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Commits] (
    [id] INT NOT NULL IDENTITY(1,1),
    [repoId] INT,
    [message] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Commits_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Repos] ADD CONSTRAINT [Repos_authorId_fkey] FOREIGN KEY ([authorId]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Commits] ADD CONSTRAINT [Commits_repoId_fkey] FOREIGN KEY ([repoId]) REFERENCES [dbo].[Repos]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
