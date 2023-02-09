document.getElementById("filepicker").addEventListener("change", (event) => {
    let output = document.getElementById("listing");
    for (const file of event.target.files) {
      let item = document.createElement("li");
      item.textContent = file.webkitRelativePath;
      output.appendChild(item);
    };
  }, false);

  const formRename = document.getElementById('formRename');
  const message = document.getElementById('message');

  // formRename.addEventListener('submit', (e) => {
  //   message.innerHTML = 'Archivos renombrados!'
  //   const url = $('#filepicker').val();
  //   console.log(url);
  //   e.preventDefault();
  // })