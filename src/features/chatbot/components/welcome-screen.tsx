export function WelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <div className="text-3xl font-bold text-gray-800 leading-relaxed">
          XIN CHÀO 👋🏻
          <br />
          Tôi rất hân hạnh giải đáp thắc mắc cho bạn
        </div>
        <div className="text-gray-600">
          Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn bên dưới
        </div>
      </div>
    </div>
  )
}