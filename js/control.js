/*
	note : 19年品牌佛山活动s2
	author : zx
	date : 2019-7-4
*/

var currentTimes = "";
var successFlag = "";
var netlink = 'http://fs.foshanplus.com:8082';


$(document).ready(function(){
	//设置滚动条控件高度
	setScrollheight();
	//获取2期榜单内容
	get_S2_list();
	//校验当日投票次数
	checkTimes();
	//进度条控制
	stateControl();
	//投票控制
	voteControl();
	//基本按钮控制
	bindBasicBTNs();
	//个人信息提交
	confrimVoteAndUploadInfo();
	//投票控制
	finalVoteControl();
	//获取排行榜
	getRanks()
});


//滑动控件初始化

function initSlide(){

	var navSwiper = new Swiper('#header', {
        freeMode: true,
        slidesPerView: 'auto',
        freeModeSticky: true,
    });

    var tabsSwiper = new Swiper('#tabs-container', {
        speed: 800,
        on: {
            slideChangeTransitionStart: function() {
                $(".tabs .active").removeClass('active');
                $(".tabs a").eq(this.activeIndex).addClass('active');
            }
        }
    })
    $(".tabs a").on('click', function(e) {
        e.preventDefault()
        $(".tabs .active").removeClass('active')
        $(this).addClass('active')
        tabsSwiper.slideTo($(this).index())
    })
}


window.onload = function() {
	initSlide();
}


function setScrollheight(){
	var availHeight = window.screen.availHeight;
	var availwidth = window.screen.availwidth;

	if(availHeight < 700){
		$(".list-group").css("height", availHeight*0.48);
		$("#introcontent").css("height", availHeight*0.44);

		$("#s1l1rank-content").css("height", availHeight*0.4);
		$("#s1l2rank-content").css("height", availHeight*0.4);
	}else if(availHeight > 700){
		$(".list-group").css("height", availHeight*0.52);
		$("#introcontent").css("height", availHeight*0.53);

		$("#s1l1rank-content").css("height", availHeight*0.4);
		$("#s1l2rank-content").css("height", availHeight*0.4);
	}
	
}


function get_S2_list(){
	$.ajax({
		type:"get",
		url: netlink + "/exam/get_vote/?exam_id=10,11,12&openid=12345",
		dataType:"json",
		success:function(data){

			for (var i=0; i < data.projects.length; i++){

				var s2listcontent = "";
				var s2modalcontent = "";

				for (var j=0; j < data.projects[i].length; j++){
					var head = '<li class="list-group-item"><fieldset class="complexOrder"><legend class="complexOrderNum">' + (j+1) + '</legend>';
					var itemUp = '<table class="list-table"><tr><td width=14% rowspan="2"><span class="list-pic" data-toggle="modal" data-target="#s2detailslist' + (j+1) + data.projects[i][j].id + '">';
					if((i == 2) && ((j == 21)||(j == 34))){
						var itemDown = '<img class="list-pic-in" src="' + data.projects[i][j].pic_url + '?imageView2/2/w/100/h/80/format/jpg/interlace/1/q/90" /></span></td><td width=79% class="list-co-small">' + data.projects[i][j].title + '</td>'
					}else if((i == 1) && ((j == 31)||(j == 33))){
						var itemDown = '<img class="list-pic-in" src="' + data.projects[i][j].pic_url + '?imageView2/2/w/100/h/80/format/jpg/interlace/1/q/90" /></span></td><td width=79% class="list-co-small">' + data.projects[i][j].title + '</td>'
					}else{
						var itemDown = '<img class="list-pic-in" src="' + data.projects[i][j].pic_url + '?imageView2/2/w/100/h/80/format/jpg/interlace/1/q/90" /></span></td><td width=79% class="list-co">' + data.projects[i][j].title + '</td>'
					}
					
					var itemCheck = '<td width=7% rowspan="2"><input onclick=stateControl("s2-list' + (j+1) + '-checkbox","s2-list2-num","s2-list2-state") type="checkbox" name="s2-list' + (j+1) + '-checkbox" class="fspCheckBox" value="' + data.projects[0][i].id + '"/ ></td></tr><tr><td>当前票数：' + data.projects[i][j].vote_count + '</td></tr></table>'

					var tail = '</fieldset></li>';

					s2listcontent += (head + itemUp + itemDown + itemCheck + tail);

					var modalhead = '<div data-backdrop="static" class="modal fade" id="s2Info' + data.projects[0][i].id + '" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content">';
					var modalbody = '<div class="modal-body" style="padding:0;"><div class="form-group" style="text-align:center;"><h4 style="color:#ffe200;">品牌介绍</h4><br/></div><div class="form-group"><div class="s1-details-modalcontent" style="text-align:justify;">' + data.projects[0][i].content + '</div></div></div><div class="modal-footer"><div style="color:#188ae2;" data-dismiss="modal">关闭</div></div>'
					var modaltail = '</div></div></div>';

					s2modalcontent += (modalhead + modalbody + modaltail);

				}
				
				//填入到dom
				$('#s2-list-list' + (i+1)).html(s2listcontent);
				$('#s2-details-modal' + (i+1)).html(s2modalcontent);
			}
		},
		error: function(){
            console.log('很抱歉，获取数据出错，请稍候再试！');
            alert("当前投票人数过多，请稍后重试get_S2_list()");
            return;
        }
     })
}


/*
 * note:每当有指定系列的checkbox选中，则检测当前状态以写入进度条
*/
function stateControl(name, num, scroll){

	var checkedItems = $('input[name=' + name + ']:checked');
	var uncheckedItems = $('input[name=' + name + ']:not(:checked)');
	var state = checkedItems.length;
	if(state === 10){
		$('#' + num).html('<span style="color:green">上限</span>');
		$('input[name=' + name + ']:not(:checked)').each(function(){
			$(this).attr('disabled',true);
		});
	}else if((state < 5) && ((state > 0) || (state === 0))){
		$('#' + num).html('<span style="color:#ee3434">' + state + '</span>/10');
		$('input[name=' + name + ']').each(function(){
			$(this).attr('disabled',false);
		});
	}else if((state < 10) && (state > 4)){
		$('#' + num).html('<span style="color:green">' + state + '</span>/10');
		$('input[name=' + name + ']').each(function(){
			$(this).attr('disabled',false);
		});
	}else if(state > 10){
		alert("当前榜单您最多选择10项");//这个不可能触发的
		return;
	}
	var stateByPercentform = 'width:' + state*10 + '%';
	$('#' + scroll).attr("style", stateByPercentform);
}


function bindBasicBTNs(){
	$("#showrules").click(function(){
		$('#introModal').modal();
	});

	$("#reselect").click(function(){
		$('input[name=s1-list1-checkbox]:checked').each(function(){
			$(this).prop("checked",false);
			clearChosen();
		});
		$('input[name=s1-list1-checkbox]').each(function(){
			$(this).attr('disabled',false);
		});
		$('input[name=s1-list2-checkbox]:checked').each(function(){
			$(this).prop("checked",false);
			clearChosen();
		});
		$('input[name=s1-list2-checkbox]').each(function(){
			$(this).attr('disabled',false);
		});
	});

	/* 确认提交页面重新获取验证码的圆圈按钮 */
	$("#getnewcode").click(function(){
		getCodePic();
	});

	/*禁用轮播图自动播放*/
	$('#mycarousel').carousel({
		pause: true,
		interval: false
	});
}

function clearChosen(){
	$("#s1-list1-state").attr("style", 'width:0%');
	$("#s1-list2-state").attr("style", 'width:0%');
	$("#s1-list1-num").html("0/10");
	$("#s1-list2-num").html("0/10");
}


/*  投票和信息登记的取消按钮，取消时清空已经填入的内容 */
function clearWastedInfo(item){
	$('#' + item).val("");
}

function voteControl(){
	$("#confirmVote").click(function(){
		checkTimes()
		var enable = currentTimes;
		// console.log(enable)
		if(enable === "can vote"){
			var s1l1num = $('input[name=s1-list1-checkbox]:checked').length;
			var s1l2num = $('input[name=s1-list2-checkbox]:checked').length;
			if((s1l1num < 5) || (s1l2num < 5)){
				alert("您还未完成投票，每个榜单至少需要选择5项");
				return;
			}else{
				getCodePic();
				$('#votemodal').modal();
			}
		}else if(enable === "cannot vote"){
			alert("当日投票次数已达上限，请明天再来");
			return;
		}else{
			alert("当前服务器忙，请重试voteControl");
			return;
		}

	});
}

function getCodePic(){
	$.ajax({
		type:"get",
		async:false,
		url: netlink + "/captcha",
		dataType:"json",
		success:function(data){
			var pic = 'data:image/png;base64,' + data.captcha.captcha_img;
			$("#picExam").attr("src", pic);
			$("#itemcodeID").val(data.captcha.item_id);
		},
		error: function(){
		    console.log('很抱歉，获取数据出错，请稍候再试！');
		    alert("当前服务器忙，请重试getCodePic");
		}
	});
}

/* 判断当前用户是否已经达到当天投票上限 */
function checkTimes(){
	var usropenid = getParam('openid');
	var currrent = getCurrentDate();
	$.ajax({
		type:"get",
		async:true,
		url: netlink + '/examlog/?exam=8&created_gte=' + currrent + '&openid=' + usropenid,
		dataType:"json",
		success:function(data){
			var times = data.results.length;
			if(times < 2){
				currentTimes = "can vote";
			}else if((times > 2) || (times === 2)){
				currentTimes = "cannot vote";
			}else {
				return;
			}
		},
		error: function(){
		    console.log('很抱歉，获取用户当日参加活动次数出错，请稍候再试！');
		    alert("当前服务器忙，请重试checkTimes");
		}
	});
}


/* 获取url参数 */
function getParam(paramName) {
    paramValue = "", isFound = !1;
    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
        arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;
        while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
    }
    return paramValue == "" && (paramValue = null), paramValue
}


/* 获取当前日期 */
function getCurrentDate(){
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

/* 判断是否登记了个人信息，若没有，则弹出框要求用户提交个人信息 */
function checkSigned(){
	var usropenid = getParam('openid');
	$.ajax({
		type:"get",
		async:false,
		url: netlink + '/wxusers/?openid=' + usropenid + '&name=&phone=',
		dataType:"json",
		success:function(data){
			var flag = data.count;
			var name = data.results.name;
			var phone = data.results.phone;
			/*首次登陆的需要登记*/
			if(flag === 0){
				alert("请填写个人信息");
				/*首次登陆用户不会有已经选择的项目，所以跳转至验证码的提交按钮隐藏，只显示过程中的提交按钮*/
				$("#getuserinfomodal").modal();
				return;
			/*非首次登陆但是没有登记信息的也需要登记*/
			}else if((flag > 0) && ((name === "") || (phone === ""))){		
				alert("请填写个人信息");	
				$("#getuserinfomodal").modal();
				return;
			}else{
				/* 当用户完成个人信息填写就不做弹出的操作了 */
				successFlag = 'userSigned';
				window.location.href = 'http://fs.foshanplus.com:8082/static/FoShanBrandS1/index.html?openid=' + usropenid;
			}
		},
		error: function(){
		    console.log('很抱歉，获取用户openid出错，请稍候再试！');
		    alert("当前服务器忙，请重试checkSigned");
		}
	});
}

function finalVoteControl(){
	$("#voteFinalConfrim").click(function(){
		var usropenid = getParam('openid');
		var item_id = $("#itemcodeID").val();//正确验证码
		var code = $("#usersetcode").val();//用户输入
		if(code == ""){
			alert("请输入验证码");
			return;
		}

		var s1l1checked = [];
		var s1l2checked = [];
		var vote_list = [];
		$('input[name=s1-list1-checkbox]:checked').each(function(i){
			s1l1checked[i] = $(this).val();
		});
		$('input[name=s1-list2-checkbox]:checked').each(function(i){
			s1l2checked[i] = $(this).val();
		});
		vote_list = s1l1checked.concat(s1l2checked);//用户选择
		var url = netlink + '/exam/add_vote_pro/?exam_id=8,9&openid=' + usropenid + '&item_id=' + item_id + '&code=' + code + '&vote_list=' + vote_list;
		$.ajax({
			type:"get",
			async:false,
			url:url,
			dataType:"json",
			success:function(data){
				var msg = data.msg;
				var res = data.is_error;
				// console.log(res)
				if(data.is_error == false){
					//投票成功提示
					alert(msg);
					//判断是否已经提交过个人信息
					checkSigned();
				}else if(data.is_error == true){

					if(data.msg == "验证码错误"){
						alert(msg);
						$("#usersetcode").val("");
						var pic = 'data:image/png;base64,' + data.data.captcha.captcha_img;
						$("#picExam").attr("src", pic);
						$("#itemcodeID").val(data.data.captcha.item_id);
					}else{
						alert(msg);
						window.location.href = 'http://fs.foshanplus.com:8082/static/FoShanBrandS1/index.html?openid=' + usropenid;
					}
				}
				
			},
			error: function(){
			    console.log('很抱歉，获取用户当日参加活动次数出错，请稍候再试！');
			    alert("当前服务器忙，请重试checkTimes");
			}
		});
	});
	
}


function giveUpAward(){
	var usropenid = getParam('openid');
	window.location.href = 'http://fs.foshanplus.com:8082/static/FoShanBrandS1/index.html?openid=' + usropenid;
}


/* 个人信息 */
function confrimVoteAndUploadInfo(){
	$("#uploadinfo-final").click(function(){
		signIn();
	});
}

function signIn(){
	var usropenid = getParam('openid');
	var name = $("#username").val();
	var phone = $("#userphone").val();
	if((name === "") || (phone === "")){
		alert("请填写完整");
		return;
	}
	$.ajax({
		type:"post",
		async:false,
		url: netlink + '/wxusers/',
		data:{"openid":usropenid,"name":name,"phone":phone},
/*		dataType:"json",*/
		success:function(data){
			alert("参与成功！请等待开奖");
			window.location.href = 'http://fs.foshanplus.com:8082/static/FoShanBrandS1/index.html?openid=' + usropenid;
		},
		error: function(){
		    console.log('很抱歉，提交用户信息错误，请稍候再试！');
		    alert("当前服务器忙，请重试signIn");
		}
	});
}


function getRanks(){
	$.ajax({
		type:"get",
		async:false,
		url:netlink + '/exam/get_vote_rank/?exam_id=8,9&top=10',
		dataType:"json",
		success:function(data){
			var s1l1rank = "";
			var s1l2rank = "";
			var line1 = '';
			var line2 = '';
			for(var i=0; i < data[0].votes.length; i++){
				line1 = '<tr><td width="10%"></td><td width="90%">' + (i+1) + '&nbsp;&nbsp;' + data[0].votes[i].title + '</td>';
				s1l1rank += line1;
			}
			$("#s1l2rank").html(s1l1rank);

			for(var i=0; i < data[1].votes.length; i++){
				line2 = '<tr><td width="10%"></td><td width="90%">' + (i+1) + '&nbsp;&nbsp;' + data[1].votes[i].title + '</td>';
				s1l2rank += line2;
			}
			$("#s1l1rank").html(s1l2rank);
		},
		error: function(){
		    console.log('很抱歉，获取排行榜失败，请稍候再试！');
		    alert("当前服务器忙，请重试signIn");
		}
	});
}
