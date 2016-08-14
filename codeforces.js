

function css_add(window_url) {
				var tag_css = document.createElement('style');
				tag_css.type = 'text/css';
				tag_css.href = window_url+'?css=1';
				var tag_head = document.getElementsByTagName('head');
				tag_head[0].appendChild(tag_css);
				
}


   var nop;
   var textpop=$('<div class="source-popup" style="width: 900px;padding: 1em; margin: 1em; font-size: 1.2rem; display: block;"><span class="source-popup-header" style="">&nbsp;</span><pre class="source prettyprint"><span class="pln">        </span><img src="http://st.codeforces.com/s/45577/images/indicator.gif"><span class="pln"></span></pre></div>');
   //$(".content").append(textpop.prop('outerHTML'));
   CreateBox = function()
   {	 
	 Codeforces.facebox(".source-popup:first", "http://st.codeforces.com/s/22875");
	 nop = $(".next-or-prev-prototype").clone().removeClass("next-or-prev-prototype").addClass("next-or-prev").css("display", "#facebox");
	// textpo2=$(".source-popup:last").clone();
	 textpop.attr('id', 'Box1');
	 $(".source-popup:last").detach();
		
  // $(".content").append(textpop.prop('outerHTML'));	 
   };
    CreatePop = function(id)
	{
		$(".content").append(textpop.clone().attr('id', id));	
	}

    ShowSource = function(submissionId,block) {
            $.post("/data/submitSource", {submissionId: submissionId}, function(data) {
				
				
                $(block).find(".source:last").text(data["source"]);
                var header = "От " + data["partyName"]
                    + ", соревнование: " + data["contestName"]
                    + ", задача: " + data["problemName"]
                    +", " + data["verdict"] + ", " + "<a title='прямая ссылка' href=\"" + data["href"] + "\">#</a>";
                if (data["offerChallenge"] == "true") {
                    header += ", <a href=\"" + data["challengeLink"] + "\">hack it!</a>";
                }
                header += "<hr/>";

                $(block).find(".source-popup-header").html(header);

				
                if ($(block).find(".footer .pagination").size() === 0) {
                    $(block).find(".footer").append(nop);
                }
                var p = $(block).find(".footer .pagination");

                if (data["prevId"]) {
                    p.find(".prev").attr("href", "#").click(function () {
                        showSubmissionSourceCode(data["prevId"]);
                        return false;
                    });
                }
                if (data["nextId"]) {
                    p.find(".next").attr("href", "#").click(function () {
                        showSubmissionSourceCode(data["nextId"]);
                        return false;
                    });
                }

                prettyPrint();

				return; // No вывод!
                var testCount = data["testCount"] ? parseInt(data["testCount"]) : 0;
                if (testCount > 0) {
                    $(block).find(".source-popup").append("<hr/><h4>&rarr;Протокол тестирования</h4>");
                }
                for (var i = 1; i <= testCount; i++) {
                    if (data["verdict#" + i]) {
                        var e = $("div.test-for-popup-proto").clone()
                            .removeClass("test-for-popup-proto").addClass("test-for-popup")
                            .css("display", block);
                        e.find(".test").text(i);
                        e.find(".time").text(data["timeConsumed#" + i]);
                        e.find(".memory").text(data["memoryConsumed#" + i] ? parseInt(data["memoryConsumed#" + i]) / 1024 : "");
                        e.find(".exitCode").text(data["exitCode#" + i]);
                        e.find(".checkerExitCode").text(data["checkerExitCode#" + i]);
                        e.find(".verdict").text(data["verdict#" + i]);

                        if (data["input#" + i]) {
                            e.find(".input").text(data["input#" + i]);
                        } else {
                            e.find(".popup-input-div").hide();
                        }

                        if (data["output#" + i]) {
                            e.find(".output").text(data["output#" + i]);
                        } else {
                            e.find(".popup-output-div").hide();
                        }

                        if (data["answer#" + i]) {
                            e.find(".answer").text(data["answer#" + i]);
                        } else {
                            e.find(".popup-answer-div").hide();
                        }

                        e.find(".checker").text(data["checkerStdoutAndStderr#" + i] ? data["checkerStdoutAndStderr#" + i] : " ");
                        $(block).find(".source-popup").append(e);
                    }
                }
            }, "json");
        };
		
Solution = function() {
	for (var i = 0; i < arguments.length; i++) {
			CreatePop("box"+arguments[i]);
			ShowSource(arguments[i],"#box"+arguments[i]);
		}
};
LoadScript = function(str)
{
 var newScript = document.createElement('script');
 newScript.type = 'text/javascript';
 newScript.src = str;
 document.getElementsByTagName("head")[0].appendChild(newScript);
}
GetSolution = function()
{
	css_add("http://st.codeforces.com/s/45577/css/facebox.css");
	LoadScript("http://st.codeforces.com/s/45577/js/facebox.js");
    var page=location.href;
	page=page.replace("http://codeforces.com/problemset/problem/","");
	page=page.replace("/","/problem/");
	page="http://codeforces.com/problemset/status/"+page;
	
	CreateBox();
	
	$("#facebox").css("top", "49.8px");
	$("#facebox").css("left", "-12.5px");
	
	$.post( page+"?order=BY_PROGRAM_LENGTH_ASC", function( data ) {
      $.each( $(".view-source",data), function( key, value ) {
      Solution(parseInt($(this).html()));  if (key==4) return false;
      });
	 $.post( page+"?order=BY_CONSUMED_TIME_ASC", function( data ) {
      $.each( $(".view-source",data), function( key, value ) {
      Solution(parseInt($(this).html()));  if (key==4) return false;
      });
    });
	});

	
};

var arr=new Array();
var result;
$(".second-level-menu-list").append('<li><a onclick="GetSolution()" style="background: #d22fcd">Лучшие решения</a></li>');
$(".second-level-menu-list").append('<li><a onclick="GoProblem()" style="background: #d22fcd">Перейти на задачу</a></li>');
GoProblem = function()
{
result = prompt("Введите номер задания", 1);
$.ajax({ 
                type: 'GET', 
                url: 'http://codeforces.com/api/contest.list?gym=false', 
                data: { get_param: 'value' }, 
                dataType:'json',
                success: function (data) { 
				           var l=0;
                           for (var i in data.result) 
						   if( data.result[i].phase=="FINISHED" && data.result[i].name.indexOf("(Div. 2)")!=-1) 
						   {  //console.log(name,data.result[i].id);
					         // console.log("http://codeforces.com/problemset/problem/"+data.result[i].id+"/C");
							 //debugger;
							 if (l==result)
							 {
							 $.post("http://codeforces.com/problemset/problem/"+data.result[i].id+"/C", function( datal ) {
								 document.write(datal);
								 document.close();
								 history.pushState('data', '', '/problemset/problem/'+data.result[i].id+"/C");
                                 while (!$(".second-level-menu-list")); 
								 $(".second-level-menu-list").append('<li><a onclick="GetSolution()" style="background: #d22fcd">Лучшие решения</a></li>');
                                 $(".second-level-menu-list").append('<li><a onclick="GoProblem()" style="background: #d22fcd">Перейти на задачу</a></li>');

								// $(".second-level-menu-list").append('<li><a onclick="GetSolution()" style="background: #d22fcd">Лучшие решения</a></li>');
							 });
								 return;
							 
							 }
					        //  arr.push(data.result[i].id);
							l++;
						   }
                             alert("Всего t- "+l);         }
            });
}
