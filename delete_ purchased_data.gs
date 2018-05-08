var spreadsheet = SpreadsheetApp.openByUrl("SHEET URL");
var sheet = spreadsheet.getSheetByName("SHEET NAME");

function deletePurchasedData(){
    var today = new Date();
    for(var i = 2; i <= sheet.getLastRow(); i++){
      var purchasedDate = sheet.getRange(i, 5).getValue();//5列目にあるpurchased dateの取得
      var diff = today.getTime() - purchasedDate.getTime();
      var diff_data = Math.floor(diff / (1000*60*60*24));
      //7日以上経過したら行削除
      if (diff_data > 7){　
        sheet.deleteRow(i)
      }
   }
}

//編集　> 現在のプロジェクトのトリガーで上記スクリプトの実行時間を指定