(
	function closures_hate_you(){
		// TODO:
		//  closures are offensive
		//  closures are beautiful
		//  closures create private variables
		//  polluting the public namespace is bad
		//  accidentally hiding variables is offensive
		//  be intentional about your private variables
		// however, https://twitter.com/BrendanEich/status/471410412609495041

		function shadeTaskElement(elem, template){
			//problem: this makes lots of assumptions about the template
			var penumbra = elem.createShadowRoot();
			var umbra = template.content.cloneNode(true);
			penumbra.appendChild(umbra);
			var done = elem.getAttributeNode("finished");
			var text = elem.getAttributeNode("title");

			var checkbox = penumbra.getElementById("task_check");
			var title = penumbra.getElementById("task_title");
			if(done)
				checkbox.checked = done.value == "true";
			if(text)
				title.value = text.value;


			//wire up observation to sync the root with its shadow

			//shadow to root:
			checkbox.addEventListener(
				"change",
				function(){
					elem.setAttribute("finished", checkbox.checked);
				}
			);
			title.addEventListener(
				"change",
				function(){
					elem.title = title.value;
				}
			);

			//root to shadow:
			function changeHandler(mut){
				function check(val){
					checkbox.checked = val == "true";
				}
				function retitle(value){
					title.value = value;
				}
				function mutationHandler(rec){
					var name = rec.attributeName;
					var value = rec.target.getAttribute(name);
					var respond = {
						finished: check,
						title: retitle
					}[name];
					respond(value);
				}
				mut.forEach(mutationHandler);
			}
			var observer = new MutationObserver(changeHandler);
			var options = {
				attributes: true,
				attributeOldValue: true,
				attributeFilter: ["finished", "title"]
			};
			observer.observe(elem, options);

		}
		function catch_task(mut){
			var task_template = document.getElementById("task");
			var tasks = mut.target.querySelectorAll("task");
			if(!tasks.length) return;
			function setup(elem){
				return shadeTaskElement(elem, task_template);
			}
			[].slice.call(tasks).map(setup);
		}
		document.addEventListener(
			"DOMNodeInserted",
			catch_task
		);
		function ready(){
			var task_template = document.getElementById("task");
			catch_task({target: document});
		}

		document.addEventListener(
			"readystatechange",
			function stateChangeHandler(){
				if("complete" == document.readyState) ready();
			}
		);
	}
)();
