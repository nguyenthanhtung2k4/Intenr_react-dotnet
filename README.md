# React/.NET Application Example

This project is an example of a simple React app using a .NET backend. This project is easy to use and set up by doing the following steps:

1. Clone the repository with `git clone https://github.com/sethbr11/react-dotnet.git` in a terminal window.
2. Navigate inside the project folder and open another terminal window in the folder.
3. In one of the terminal windows, enter the backend folder and run `dotnet run` to start the backend part of the application.
4. In the other terminal window, enter the frontend folder. From there, run `npm install` to install all the dependencies needed to run the application.
5. In the same frontend folder, run `npm run start` to start the frontend part of the application. It should automatically open a browser window to the application displaying a table which pulls data from the .NET backend.

## Prerequisites
In order to run this project, you will need .NET installed on your computer as well as Node. Make sure these are in place first.

## Disclaimer
This is just an example app for the development side of things only. This is not suitable for production environments as is.

## Folder 
```  bash 
/Intenr_react-dotnet
├── .env                  # <--- FILE MỚI: Chứa Base URL
├── node_modules
├── public
├── src
│   ├── assets
│   ├── components        # Chứa các component UI nhỏ, có thể tái sử dụng
│   ├── component         # (Giữ theo cấu trúc cũ của anh, nhưng nên đổi tên thành 'pages' hoặc 'views')
│   │   ├── Home          # Chứa các màn hình chính (Views/Pages)
│   │   │   ├── App.tsx   # (Đã di chuyển về thư mục gốc src)
│   │   │   ├── BowlersTable.tsx  # Danh sách chính (Home View)
│   │   │   ├── BowlerForm.tsx    # <--- FILE MỚI: Gộp Create & Edit
│   │   │   ├── createTeams.tsx   # Tạo Teams
│   │   │   ├── Delete.tsx        # <--- SỬA TÊN TỪ Detele.tsx
│   │   │   ├── team.tsx          # Chi tiết Team (Danh sách Bowlers theo team)
│   │   │   └── viewCreate.tsx    # View Teams
│   │   └── Header.tsx
│   ├── services          # <--- FOLDER MỚI: Logic giao tiếp API
│   │   └── api.services.tsx    # <--- FILE MỚI: Centralized API
│   ├── types             # Chứa các TypeScript Interfaces
│   │   ├── Bowler.ts
│   │   ├── Teams.ts
│   │   └── ...
│   ├── App.css
│   ├── index.css
│   └── main.tsx / index.tsx
└── package.json
```


# db : 

```bash
Tên Lớp (File),Chức Năng (Vai trò là một bảng DB),Giải thích
Team.cs,Bảng Đội,"Lưu trữ thông tin về mỗi đội tham gia giải đấu (ví dụ: Tên đội, ID đội)."
Bowler.cs,Bảng Vận động viên Bowling,"Lưu trữ thông tin cá nhân của mỗi người chơi bowling (ví dụ: Tên, tuổi, ID đội mà họ thuộc về)."
Tournament.cs,Bảng Giải Đấu,"Lưu trữ thông tin về các sự kiện giải đấu tổng thể (ví dụ: Tên giải đấu, ngày bắt đầu, ngày kết thúc)."
TourneyMatch.cs,Bảng Trận Đấu của Giải Đấu,"Lưu trữ thông tin về các trận đấu cụ thể diễn ra trong một giải đấu (ví dụ: ID trận đấu, ID đội thắng, ID đội thua)."
MatchGame.cs,Bảng Trò Chơi (Game) trong Trận Đấu,"Lưu trữ thông tin chi tiết hơn về từng trò chơi/ván đấu (game) riêng lẻ trong một trận đấu (ví dụ: ID trận đấu, số game, điểm game, người thắng game)."
BowlerScore.cs,Bảng Điểm của Vận Động Viên,Lưu trữ chi tiết điểm số của một vận động viên bowling trong một game hoặc một khung (frame) cụ thể. Đây là bảng quan trọng để tính toán tổng điểm.
``` 
