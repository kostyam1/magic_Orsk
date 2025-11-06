<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); // если форма на том же домене — можно убрать

$BOT_TOKEN = '0';
$CHAT_ID = '1080472563';

// получаем данные
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) { echo json_encode(['error'=>'Нет данных']); exit; }

$name = htmlspecialchars($data['name'] ?? '');
$phone = htmlspecialchars($data['phone'] ?? '');
$message = htmlspecialchars($data['message'] ?? '');

// простая валидация
if (!$name || !$phone) {
  echo json_encode(['error'=>'Поля обязательны']);
  exit;
}

$text = "✨ *Новая заявка с сайта*\n👤 Имя: $name\n📞 Телефон: $phone\n💬 Сообщение: $message";

$url = "https://api.telegram.org/bot$BOT_TOKEN/sendMessage";

$params = [
  'chat_id' => $CHAT_ID,
  'text' => $text,
  'parse_mode' => 'Markdown'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($err) {
  echo json_encode(['error'=>$err]);
} else {
  echo json_encode(['success'=>true]);
}
?>
