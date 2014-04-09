
$('.bind').one('click',function(){
	var lottery = new Lottery('canvas-container','#d7d7d7','刮奖区','color', 270, 140, drawPercent);
	lottery.init('刮奖区','text');
	function drawPercent(percent) {
		console.log(percent + '%');
	}
})