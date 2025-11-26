# 21 Savage Fan Message Board

A simple full-stack **fan message board** for 21 Savage fans. Users can post messages, like or dislike them, and delete posts.  
Built with **Node.js**, **Express**, **MongoDB**, and **EJS**.

---

## 🚀 Features

-Add fan messages  
- Like or 👎 dislike messages  
- Delete messages  
- 🔁Real-time updates (auto page reload)  
- Persistent storage with MongoDB Atlas  

---

## Launch Demo

- Demo: [21 Savage Fan Message Board](https://savage-demo-dd4y.onrender.com)

---

## 🧠 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Backend** | Node.js, Express |
| **Database** | MongoDB Atlas |
| **Frontend** | EJS, Vanilla JavaScript, Font Awesome |
| **Styling** | Custom CSS |

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/21savage-fanboard.git
cd 21savage-fanboard
````

### 2. Install Dependencies

```bash
npm install
```

### 3.  Set Up MongoDB

* Create a free MongoDB Atlas cluster
* Update the connection string inside `server.js`:

```js
const url = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/21savage?retryWrites=true&w=majority";
```

---

##  Usage

### Start the server:

```bash
npm run savage
```

> Or, if `nodemon` is not installed globally:

```bash
npx nodemon server.js
```

### Open your browser:

```
http://localhost:3000
```

Now you can post messages, like/dislike others, and delete your own —
all while *trapping hard and keeping it savage.*

---

## 📁 Project Structure

```
├── public/           # Static assets (JS, CSS, images)
│   ├── main.js       # Client-side logic (like/dislike/delete)
│   └── styles.css    # Custom styling
├── views/            # EJS templates
|   └── index.ejs     # main page
├── server.js         # Express server + MongoDB logic
├── package.json
└── README.md
```

---

## 🔧 Scripts

| Command          | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `npm run savage` | Starts the app using `nodemon` (auto-restart on changes) |

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch

   ```bash
   git checkout -b feature/cool-thing
   ```
3. **Commit** your changes

   ```bash
   git commit -m "Add cool thing"
   ```
4. **Push** to your branch

   ```bash
   git push origin feature/cool-thing
   ```
5. **Open a Pull Request**

---

## 📜 License

This project is open source and available under the **MIT License**.

---

> “Why you trappin’ so hard?” — *21 Savage (probably)*

