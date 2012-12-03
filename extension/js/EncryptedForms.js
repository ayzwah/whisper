var EncryptedForms = new function ()
{
	this.forms = new Array();
	
	this.add = function(element)
	{	// if it is a form (supposedly), works for facebook status (confirmed), but not gmail
		if (element.form != null)
		{
			$(element).closest(".uiTypeahead").css({ "background": "top right no-repeat url('"+chrome.extension.getURL("img/lock.png")+"')", "background-color": "#5cff68" });
			EncryptedForms.forms[element.form.name] = [element, false];
			$(element.form).submit(function (e)
			{
				if (!EncryptedForms.forms[e.target.name][1])
				{
					EncryptedForms.forms[e.target.name][1] = true;
					EncryptedForms.forms[e.target.name][0].value = encrypt(EncryptedForms.forms[e.target.name][0].value);
					$(e.target).find("input[name='xhpc_message']").val(EncryptedForms.forms[e.target.name][0].value);
					$(e.target).find(".highligherContent .hidden_elem").html(EncryptedForms.forms[e.target.name][0].value);
					setTimeout("EncryptedForms.submit('"+e.target.name+"');", 10);
					return false;
				}
			});
		}
		else 
		{ // if it's not a form - works for facebook chat and gchat (confirmed)
			$(clickedEl).closest("table").css({ "background": "top right no-repeat url('"+chrome.extension.getURL("img/lock.png")+"')", "background-color": "#5cff68" });
			/* second argument true to use event capturing instead of bubbling (described http://www.quirksmode.org/js/events_order.html)
			   In order to ensure our event listener gets added first, adds the listener to the parent of the clicked element
			   so that event capturing hits the outside wrapper first and gets our listener first */ 
			$(clickedEl).parent().get(0).addEventListener('keydown', function(e){ 
				if (e.keyCode == 13 && !e.shiftKey) { 
					clickedEl.value = encrypt(clickedEl.value);
					return false;
				} 
			}, true);
		}
	}
	
	this.submit = function(id)
	{
		$(this.forms[id][0].form).find("input[type='submit'], button").trigger("click");
		this.forms[id][1] = false;
	}
}	