
var bookDataFromLocalStorage = [];

$(function(){
    loadBookData();
    var data = [
        {text:"資料庫",value:"database"},
        {text:"網際網路",value:"internet"},
        {text:"應用系統整合",value:"system"},
        {text:"家庭保健",value:"home"},
        {text:"語言",value:"language"},
        {text:"管理",value:"manage"},
        {text:"行銷",value:"marketing"}
    ]
    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: data,
        index: 0,
        change: onChange
    });
    $("#bought_datepicker").kendoDatePicker({
        value: new Date(),
        format: "yyyy-MM-dd"
    });
    
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    fields: {
                        BookId: {type:"int"},
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookBoughtDate: { type: "string" },
                        BookPublisher: {type: "string"}

                    }
                }
            },
            pageSize: 20,
        },
        toolbar: kendo.template("<div class='book-grid-toolbar'><input class='book-grid-search' placeholder='我想要找......' type='text'></input></div>"),
        height: 550,
        sortable: true,
        pageable: {
            refresh: true,
            input: true,
            numeric: false
        },
        
        columns: [
            { field: "BookId", title: "書籍編號",width:"7%"},
            { field: "BookName", title: "書籍名稱", width: "45%" },
            { field: "BookCategory", title: "書籍種類", width: "10%" },
            { field: "BookAuthor", title: "作者", width: "15%" },
            { field: "BookBoughtDate", title: "購買日期", width: "13%" },
            { field: "BookPublisher", title: "出版社", width: "10%"},
            { command: { text: "刪除", click: deleteBook }, title: " ", width: "120px" }
        ]
    });

    $(".book-grid-search").bind('input porpertychange',function(){
        var target = $(".book-grid-search").val();
        $("#book_grid").data("kendoGrid").dataSource.filter({
            logic: "or",
            filters: [
                {
                    field: "BookName",
                    operator: "contains",
                    value: target
                },
                {
                    field: "BookAuthor",
                    operator: "contains",
                    value: target
                },
            ]
        });
    });


    /*myWindow.kendoWindow({
        width: "600px",
        title: "Create a book",
        visible: false,
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
        close: onClose
    }); */ 

})

function loadBookData(){
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem("bookData"));
    if(bookDataFromLocalStorage == null){
        bookDataFromLocalStorage = bookData;
        localStorage.setItem("bookData",JSON.stringify(bookDataFromLocalStorage));
    }
}

function onChange(){

    var value = $("#book_category").val();
    $(".book-image").attr("src", "image/" + value + ".jpg");
    
}

function deleteBook(options){
  
    var grid = $("#book_grid").data("kendoGrid"); 
    var dataItem = grid.dataItem($(options.currentTarget).closest("tr"));

    grid.dataSource.remove(dataItem);
    
    var localData = JSON.parse(localStorage["bookData"]);
    for(var i = 0 ; i < localData.length ; i++)
    {
        if(localData[i].BookId == dataItem.BookId)
        {
            console.log("find!");
            localData.splice(i, 1);
            break;
        }
    }

    localStorage["bookData"] = JSON.stringify(localData);
};



$(".addbook").click(function(){

    if (validator.validate()){
        /*status.text("Hooray! Your tickets has been booked!")
            .removeClass("invalid")
            .addClass("valid");*/
            var b_category = $("#book_category").data("kendoDropDownList").text()
            var b_name = $("#book_name").val();
            var b_author = $("#book_author").val();
            var b_data = $("#bought_datepicker").val();
            var b_publisher = $("#book_publisher").val();
        
            
            var localData = JSON.parse(localStorage["bookData"]);
            var b_id = localData[localData.length - 1].BookId + 1;
        
            var datasource = JSON.parse(localStorage.getItem("bookData"));
            datasource.push({
                BookId: b_id,
                BookCategory: b_category,
                BookName: b_name,
                BookAuthor: b_author,
                BookBoughtDate: b_data,
                BookPublisher: b_publisher
            });
        
            //grid.dataSource.add();
        
            localStorage.setItem("bookData",JSON.stringify(datasource));
        
            var grid = $("#book_grid").data("kendoGrid");
        
            $("#window").data("kendoWindow").close();
            location.reload();

    }
    else {
        $(".status").text("Oops! There is invalid data in the form.")
            .removeClass("valid")
            .addClass("invalid");
    }



   /* var b_category = $("#book_category").data("kendoDropDownList").text()
    var b_name = $("#book_name").val();
    var b_author = $("#book_author").val();
    var b_data = $("#bought_datepicker").val();
    var b_publisher = $("#book_publisher").val();

    
    var localData = JSON.parse(localStorage["bookData"]);
    var b_id = localData[localData.length - 1].BookId + 1;

    var datasource = JSON.parse(localStorage.getItem("bookData"));
    datasource.push({
        BookId: b_id,
        BookCategory: b_category,
        BookName: b_name,
        BookAuthor: b_author,
        BookBoughtDate: b_data,
        BookPublisher: b_publisher
    });

    //grid.dataSource.add();

    localStorage.setItem("bookData",JSON.stringify(datasource));

    var grid = $("#book_grid").data("kendoGrid");

    $("#window").data("kendoWindow").close();
    location.reload();*/
   

});


$(document).ready(function(){
    
    var myWindow = $("#window"),
    undo = $("#undo");

    undo.click(function() {
        myWindow.data("kendoWindow").center().open();
        //undo.fadeOut();
    });

    function onClose() {
         undo.fadeIn();
    }

    myWindow.kendoWindow({
        width: "600px",
        title: "Create a book",
        visible: false,
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
        close: onClose
    });     
});

/*$("#undo").click(function(){
    myWindow.data("kendoWindow").center().open();
})*/


var validator = $("#CreateBookForm").kendoValidator().data("kendoValidator"),
    status = $(".status");
