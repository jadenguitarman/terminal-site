function animate () {
	//inspiration for effect found at https://codepen.io/rebswu/full/jKeKZP
	//inspiration and proper regex for tokenization found at http://jsfiddle.net/raisch/pHaeR/

	var style_params = [];
	var spans = [...document.body.querySelectorAll('.terminalScreen span')];
	spans.forEach((element,i)=>{
		var total = [];
		var s = element.innerHTML.split(new RegExp('\\s*(\\.{3}|\\w+\\-\\w+|\\w+\'(?:\\w+)?|\\w+|[\\[\\!\\"\\#\\$\\%\\&\\\'\\(\\)\\*\\+\\,\\\\\\-\\.\\/\\:\\;\\<\\=\\>\\?\\@\\[\\]\\^\\_\\`\\{\\|\\}\\~\\]])')).filter(x=>!!x);
		let orig = element.innerHTML;
		while (s.includes("<")) {
			s.splice(
				s.indexOf("<"),
				s.slice(
					s.indexOf("<"),
					s.indexOf(">")+1
				).length,
				orig.slice(
					orig.indexOf("<"),
					orig.indexOf(">")+1
				)
			);
			orig = orig.split(">").slice(1).join(">");
		}
		s.forEach((token,ti)=>{
			let whitelist = ["<a href", "</a>", "<span", "</span>", "<small", "</small>"];
			for (let i=0; i<whitelist.length; i++) {
				if (token.startsWith(whitelist[i])) {
					total[ti] = token;
					return;
				}
			}
			var color = "pink";
			if ("(){}[];:'\".,><\\/?+-=_|!@#$%^&*`~".includes(token)) color="white";
			else if (["html", "js", "javascript", "css"].includes(token.toLowerCase())) color="purple";
			else if (["web", "developer", "designer", "front-end", "senior", "developers", "administrators"].includes(token.toLowerCase())) color="orange";
			else if (token.split("").map(x=>"1234567890".includes(x)).every(x=>x)) color="babyBlue";
			total[ti] = [];
			token.split("").forEach(l=>{
				total[ti].push("<span class='"+color+"'>"+l+"</span>");
				element.innerText = element.innerText.slice(1);
			});
			if (element.innerText[0]==" " && element.innerText[1]!="<") {
				total[ti].push("<span>&nbsp;</span><wbr>");
				element.innerText = element.innerText.slice(1);
			}
			total[ti] = total[ti].join("");
		});
		let chars = total.length;
		total = total.join("").split("<span>&nbsp;</span><wbr>").map((x,i,a)=>{
			if (a.length==i+1) {
				return x;
			} else if (x.startsWith("</")) {
				return x.split(">").slice(1).join(">");
			} else if (a[i+1].startsWith("</")) {
				return x + a[i+1].split(">")[0]+">";
			} else {
				return x;
			}
		}).join("<span>&nbsp;</span><wbr>");
		i++;
		document.getElementById("terminalOL").innerHTML += '<li class="number'+i+'"><div class="line line'+i+'">'+total+'<span class="cursor'+i+'">_</span></p></li>';
		element.parentNode.removeChild(element);
		style_params.push([i, chars/25]);
	});

	var code_styles = document.getElementById("codestyles");
	code_styles.innerHTML = "";

	(an = index=>{
		let [i, timeout] = style_params[index];
		code_styles.innerText += '.number'+i+'{-webkit-animation: type '+timeout+'s '+timeout+'s steps(50, end) forwards;-moz-animation: type '+timeout+'s '+timeout+'s steps(50, end) forwards;-o-animation: type '+timeout+'s '+timeout+'s steps(50, end) forwards;animation: type '+timeout+'s '+timeout+'s steps(50, end) forwards;}.line'+i+'{-webkit-animation: type '+timeout+'s '+timeout+'s steps(50, end) forwards;-moz-animation: type '+timeout+'s '+timeout+'s steps(50, end) forwards;-o-animation: type '+timeout+'s '+timeout+'s steps(50, end) forwards;animation: type '+timeout+'s '+timeout+'s steps(50, end) forwards;}.cursor'+i+'{-webkit-animation: blink '+timeout+'s 1s '+((index==style_params.length-1)?2:1)+' forwards;-moz-animation: blink '+timeout+'s 1s '+((index==style_params.length-1)?2:1)+' forwards;-o-animation: blink '+timeout+'s 1s '+((index==style_params.length-1)?2:1)+' forwards;animation: blink '+timeout+'s 1s '+((index==style_params.length-1)?"infinite":1)+' forwards;}';
		index++;
		if (index==style_params.length) return; //we're done then
		setTimeout(()=>an(index), timeout*1200);
	})(0);
}
animate();
