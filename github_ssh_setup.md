# Setting Up GitHub with SSH Authentication

## 1. Check for Existing SSH Keys

```bash
ls -la ~/.ssh
```

If you see files like `id_rsa` and `id_rsa.pub`, you already have SSH keys.

## 2. Generate a New SSH Key (if needed)

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Press Enter to accept the default file location. Enter a passphrase for security (recommended).

## 3. Start the SSH Agent

```bash
eval "$(ssh-agent -s)"
```

## 4. Add Your SSH Key to the Agent

```bash
ssh-add ~/.ssh/id_ed25519
```

## 5. Copy Your SSH Public Key

```bash
cat ~/.ssh/id_ed25519.pub
```

Copy the output.

## 6. Add the SSH Key to GitHub

1. Go to: https://github.com/settings/keys
2. Click "New SSH key"
3. Give it a title (e.g., "My Laptop")
4. Paste your public key into the "Key" field
5. Click "Add SSH key"

## 7. Update Your Git Remote to Use SSH

```bash
git remote set-url origin git@github.com:joancose00/trim-react.git
```

## 8. Push Your Code

```bash
git push -u origin master
```

## 9. Test Your SSH Connection

```bash
ssh -T git@github.com
```

You should see: "Hi joancose00! You've successfully authenticated"