const path = require("path");

module.exports = {
    name: "luat",

    async execute(message) {
        if (!message.guild) {
            return message.reply("Lenh nay chi dung duoc trong server.");
        }

        const content = `# Các nội dung và hành vi bị cấm :no_entry_sign:

-# -----------------------------------------------------------------------------------

:one:  Chia sẻ link lừa đảo, virus, link ref/code và quảng bá trang cá nhân có nội dung hack/cheat

:two:  Gửi link mời tham gia Discord server khác khi chưa được cho phép nhằm nhằm lôi kéo, dụ dỗ thành viên rời khỏi server

:three:  Đăng tải thông tin giả mạo hoặc chưa được xác thực

:four:  Mua bán, quảng cáo, thuê mướn, nhờ vả like/follow, khảo sát, hoặc các hành vi trục lợi cá nhân (bao gồm QR code)

:five:  Nội dung không lành mạnh: 18+, hack/cheat, cày thuê, tiêu cực, kinh dị/jump scare, chính trị, trái thuần phong mỹ tục Việt Nam

:six:  Sử dụng tên, hình ảnh, chức danh của lực lượng chức năng (trong và ngoài nước) không phù hợp và đặt nickname chứa từ ngữ phản cảm

:seven:  Spam chat, reaction, hoặc lạm dụng CAPS LOCK và Tag hoặc làm phiền streamer trong server

:eight:  Giả mạo (ảnh, tên, thông tin...) gây nhầm lẫn với Herina hoặc các bot trong server

:nine:  Xúc phạm, chửi bậy quá mức, gây tranh cãi, phân biệt vùng miền (Lưu ý: Không cần biết đúng sai, chỉ cần tham gia vào tranh chấp đều có thể bị xử lý

:keycap_ten:  Cố tình tag/reply người lạ trên kênh public gây phiền toái (sẽ xử lý nếu bị report)


-# Cảm ơn mọi người đã giành thời gian để đọc và cảm ơn những anh em <@&1483823636472397856> đã gửi gắm những bút chất lượng của mình cho server này :tixung: !!!

Mọi góp ý về luật, báo cáo, cá nhân, server đều có thể gửi vào kênh <#1482351357783576680> để Herina tiếp nhận.`;
        const imagePath = path.join(__dirname, "..", "..", "public", "images", "dangcap.png");
        await message.channel.send({
            content,
            files: [imagePath]
        });
    }
};
