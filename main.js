// إعداد Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAkFRJzsxsH6P3QJov1fsxFTzckj4udblg",
    authDomain: "for-my-8351f.firebaseapp.com",
    projectId: "for-my-8351f",
    storageBucket: "for-my-8351f.appspot.com",
    messagingSenderId: "17768543901",
    appId: "1:17768543901:web:3ad88a25e6da83e1ce4674",
    measurementId: "G-EXMS8WNPCT"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// مرجع قاعدة البيانات
const database = firebase.database();

// التسجيل
function signup() {
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            database.ref('users/' + user.uid).set({
                username: username,
                email: email
            });
            showNotification('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول', 'info');
            showLogin();
        })
        .catch((error) => {
            showNotification('حدث خطأ: ' + error.message, 'error');
        });
}

// تسجيل الدخول
function login() {
    const email = document.getElementById('loginIdentifier').value;
    const password = document.getElementById('loginPassword').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            showFilePage(user.uid);
        })
        .catch((error) => {
            showNotification('اسم المستخدم أو البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
        });
}

// تسجيل الخروج
function logout() {
    firebase.auth().signOut().then(() => {
        showLogin();
        showNotification('تم تسجيل الخروج بنجاح', 'info');
    }).catch((error) => {
        showNotification('حدث خطأ: ' + error.message, 'error');
    });
}

// عرض صفحة الملفات بعد تسجيل الدخول
function showFilePage(userId) {
    document.getElementById('filePage').style.display = 'block';
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('headerText').style.display = 'none';

    const userWelcome = document.querySelector('.welcome-message');
    database.ref('users/' + userId).once('value').then((snapshot) => {
        const username = snapshot.val().username;
        userWelcome.textContent = `مرحبًا، ${username}!`;
        userWelcome.style.display = 'block';
    });

    // باقي الكود كما هو
}

// عرض اسم الملف المختار
function showFileName() {
    const fileInput = document.getElementById('fileInput');
    const fileNameDiv = document.getElementById('fileName');
    if (fileInput.files.length > 0) {
        fileNameDiv.textContent = fileInput.files[0].name;
    } else {
        fileNameDiv.textContent = '';
    }
}

// عرض إشعار للمستخدم
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    notification.style.opacity = 1;
    setTimeout(() => {
        notification.style.opacity = 0;
        notification.style.display = 'none';
    }, 3000);
}

// إنشاء مجلد جديد
function createFolder() {
    const folderName = prompt('أدخل اسم المجلد الجديد:');
    if (!folderName) return;

    const username = localStorage.getItem('loggedInUser');
    const userFiles = JSON.parse(localStorage.getItem(username)) || [];
    userFiles.push({ name: folderName, isFolder: true });
    localStorage.setItem(username, JSON.stringify(userFiles));
    showFilePage(username);
}

// إعادة التسمية
function renameFile(index) {
    const username = localStorage.getItem('loggedInUser');
    const userFiles = JSON.parse(localStorage.getItem(username)) || [];
    const file = userFiles[index];

    const newName = prompt('أدخل اسم الملف الجديد:', file.name);
    if (newName) {
        file.name = newName;
        localStorage.setItem(username, JSON.stringify(userFiles));
        showFilePage(username);
    }
}

// حذف الملف
function deleteFile(index) {
    const username = localStorage.getItem('loggedInUser');
    const userFiles = JSON.parse(localStorage.getItem(username)) || [];
    
    userFiles.splice(index, 1);
    localStorage.setItem(username, JSON.stringify(userFiles));
    showFilePage(username);
    showNotification('تم حذف الملف بنجاح', 'info');
}

// إظهار صفحة التسجيل
function showSignup() {
    document.getElementById('signupPage').style.display = 'block';
    document.getElementById('loginPage').style.display = 'none';
}

// إظهار صفحة تسجيل الدخول
function showLogin() {
    document.getElementById('signupPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('filePage').style.display = 'none';
    document.querySelector('.welcome-message').style.display = 'none';
}