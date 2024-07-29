//Lấy các phần tử DOM cần thiết từ HTML
const typingText = document.querySelector(".typing-text p"), // Chứa văn bản cho sẵn
inpField = document.querySelector(".wrapper .input-field"), // Trường nhập văn bản 
timeTag = document.querySelector(".time span b"),
scoreTag = document.querySelector(".score span"),
wpmTag = document.querySelector(".wpm span"),
cpmTag = document.querySelector(".cpm span");
tryAgainBtn = document.querySelector("button");

let timer,      // Biến để lưu ID của bộ đếm thời gian
maxTime = 60,   // Thời gian tối đa của trò chơi (giây)
timeLeft = maxTime, //Thời gian khởi tạo
charIndex = mistakes = scores = isTyping = 0;   // Biến đếm chỉ số ký tự, lỗi, điểm, trạng thái gõ

//Random văn bản
function randomParagraph() {
    // Lấy đoạn văn ngẫu nhiên trong paragraphs.js
    let randIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = "";   // Xóa nội dung hiện tại của typingText

    // Tách đoạn văn bản ngẫu nhiên thành các ký tự và cho mỗi ký tự nằm trong <span>
    paragraphs[randIndex].split("").forEach(span => {
        let spanTag = `<span>${span}</span>`;
        typingText.innerHTML += spanTag;
    });

    // Đánh dấu ký tự đầu tiên là "active" để người dùng biết điểm bắt đầu gõ
    typingText.querySelectorAll("span")[0].classList.add("active");

    // Bắt sự kiện
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

//Gõ văn bản và check
function initTyping() {
    const characters = typingText.querySelectorAll("span");  // Lấy tất cả các thẻ span chứa ký tự
    let typedChar = inpField.value.split("")[charIndex];     // Lấy ký tự được gõ từ input

    if (charIndex < characters.length - 1 && timeLeft > 0) {
        // Một khi thời gian đã bắt đầu thì sẽ không restart mỗi khi nhập hay click 
        if (!isTyping) {  
            timer = setInterval(initTimer, 1000);   // Đếm thời gian (1 giây)
            isTyping = true;    
        }

        //Xóa chữ đứng trước khi nhấn Backspace
        if (typedChar == null) {
            charIndex--;
            characters[charIndex].classList.remove("correct","incorrect");
        } 
        else {
            // Nếu ký tự nhập vào trùng khớp với ký tự hiển thị thì thêm lớp correct/ ngược lại thì incorrect  
            if (characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add("correct");
                scores++;   // Cộng điểm khi gõ đúng            
            } 
            else {
                characters[charIndex].classList.add("incorrect");
                mistakes++;
                scores--;   // Trừ điểm khi gõ sai 
            }
            charIndex++;  // Tăng charIndex dù người dùng gõ đúng hay sai ký tự
        }
        
        // Xóa lớp "active" khỏi tất cả các thẻ span và thêm lớp "active" cho ký tự hiện tại
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        // Tính WPM
        let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
        // Khi wpm đang có giá trị = 0, rỗng hoặc infinity thì đặt giá trị của nó là 0
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

        // Cập nhật trên giao diện
        scoreTag.innerText = scores; 
        wpmTag.innerText = wpm;
        cpmTag.innerText = charIndex - mistakes;    //cpm khong dem mistakes
    }
    else {
        inpField.value = "";    // Xóa giá trị của input khi hết thời gian
        clearInterval(timer);   // Ngưng thời gian
    }
}

// Khởi động bộ đếm thời gian
function initTimer() {
    // Nếu thời gian còn lại lớn hơn 0, giảm thời gian còn lại, nếu không thì dừng 
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
    }
    else{
        clearInterval(timer);   // Dừng bộ đếm khi hết thời gian
    }
}

// Reset trò chơi
function resetGame() {
    randomParagraph();      // Hiển thị văn bản ngẫu nhiên
    inpField.value = "";    // Xóa các giá trị của input được nhập trước đó
    clearInterval(timer);
    //Đặt các biến về mặc định
    timeLeft = maxTime,
    charIndex = mistakes = scores = isTyping = 0;
    timeTag.innerText = timeLeft;
    scoreTag.innerText = scores; 
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
}

// Khởi chạy
randomParagraph();   // Hiển thị đoạn văn bản ngẫu nhiên ngay khi bắt đầu
inpField.addEventListener("input", initTyping);     // Chạy hàm initTyping khi có sự thay đổi trong input
tryAgainBtn.addEventListener("click", resetGame);   // Chạy khi nhấn Try Again