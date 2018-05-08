spreadsheet = SpreadsheetApp.openByUrl("YOUR SHEET URL");
sheet = spreadsheet.getSheetByName("SHEET NAME");

//listの買ってないものの内容が見たい時
function getList(){
    var result = [];
    for(var i = 2; i <= sheet.getLastRow(); i++){
      var index = sheet.getRange(i, 1).getValues();//１列 = index
      var list = sheet.getRange(i, 3).getValues();//3列 = list
      var status = sheet.getRange(i, 4).getValues();//4列 = status
      if(status == 0){
        result.push(index + ' : ' + list)
      };
   };
  return result
}

//listの全ての内容が見たい時
function getAllList(){
    var result = [];
    for(var i = 2; i <= sheet.getLastRow(); i++){
      var index = sheet.getRange(i, 1).getValues();
      var list = sheet.getRange(i, 3).getValues();
      var status = sheet.getRange(i, 4).getValues();
      result.push(index + ' : ' + list + ' : ' +　status)
     };
  return result
}
//listに追加する場合
function addToList(add_list_from_user) {
  var firstRow = sheet.getLastRow() + 1;　//リストの最終行の次から入力
  var today = new Date();
  for(var i = 0; i < add_list_from_user.length; i++){
    sheet.getRange(firstRow + i, 1).setValue(firstRow + i);//indexをセットする
    sheet.getRange(firstRow + i, 2).setValue(today);//日付を入れる
    sheet.getRange(firstRow + i, 3).setValue(add_list_from_user[i]);//リストとして追加
    sheet.getRange(firstRow + i, 4).setValue(0);//未購買　= 0 としてstatusを登録
   }
}

//listあった物を買った場合
function updateList(bought_list_from_user) {
  var done_date = new Date();
  for(var i = 0; i < bought_list_from_user.length; i++){
    sheet.getRange(bought_list_from_user[i], 4).setValue("done"); //statusを0から"done"に変更
    sheet.getRange(bought_list_from_user[i], 5).setValue(done_date);//今日の日付でdone_dateを追記
  }
}

function doGet() {  
    return ContentService.createTextOutput('hello');
}

function doPost(e) {
  var reply_token= JSON.parse(e.postData.contents).events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return;
  }
  var user_message = JSON.parse(e.postData.contents).events[0].message.text;
  var reply_messages; //botに話しかけたらどう返信するか
  //シートと入力したら、シートのURLを返信
  if ('シート' == user_message) {
  　 　reply_messages = ["SHEET URL"];
  //ヘルプと入力したら、入力できるコマンド全てを返信
  }else if('ヘルプ' == user_message){
    reply_messages = ["L,\nLA,\nW\\n買いたいもの,\nB\\n買ったものの番号\nのどれかで入力して"];
  //W（小文字可）から始まるコマンドの場合、W以外の文字列をリストとして追記
  }else if(user_message.match(/^W/i)){
  　 　var add_list_from_user = user_message.split(",");
    add_list_from_user.shift();
    addToList(add_list_from_user);
    var result = getList();
    reply_messages = ["買いたいものね、追加するよ\n" + result.join("\n") + "\n⇧追加したよ"];
  //B（小文字可）から始まるコマンドの場合、B以外の文字列を購買リストとして追記
  }else if(user_message.match(/^B/i)){
  　 　var bought_list_from_user = user_message.split(",");
    bought_list_from_user.shift()
    updateList(bought_list_from_user);
    reply_messages = ["買ったものね、リストを更新するね"];
  //LA（小文字可）から始まるコマンドの場合、リストの全てを取得して返信
  }else if(user_message.match(/^LA/i)){
    var result = getAllList();
    reply_messages = ["List All\n" + result.join("\n")];
  //L（小文字可）から始まるコマンドの場合、リストの未購買のみを取得して返信
  }else if (user_message.match(/^L/i)){
    var result = getList();
    reply_messages = ["まだ買っていないもの\n" + result.join("\n")];
  //上記どれにも当てはまらない場合
  }else {
    reply_messages = ["W\\n買いたいもの,\nB\\n買ったものの番号\nのどれかで入力して"];
  }
  
  var messages = reply_messages.map(function (v) {
    return {'type': 'text', 'text': v};    
  });
  
  var url = 'https://api.line.me/v2/bot/message/reply';
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + 'TOKEN FROM LINE',
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': reply_token,
      'messages':  messages,
    }),
  });
 return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}