<script lang="ts">
	import Icon from "@iconify/svelte"
	import { createEventDispatcher } from "svelte"

	let state: number = 0
	let uploadError: string | undefined
	const dispatch = createEventDispatcher()

	function handleDrop(e: DragEvent) {
		state = 0
		let files = e.dataTransfer?.files

		if (files) {
			handleFiles(files)
		}
	}

	function handleFileChange(e: any) {
		let fileList = e.target.files
		handleFiles(fileList)
	}

	function handleFiles(files: FileList) {
		let file = files[0]

		if (
			file.type == "image/jpeg" ||
			file.type == "image/png" ||
			file.type == "image/svg+xml" ||
			file.type == "image/svg" ||
			file.type == "image/gif"
		) {
			const image = new Image()

			image.onload = () => {
				const maxWidth: number = 800
				const maxHeight: number = 800

				if (image.width > maxWidth || image.height > maxHeight) {
					uploadError = "Your image resolution is bigger than 800x800px."
					return
				} else {
					let reader = new FileReader()

					reader.onload = (e) => {
						let fileContent = e.target?.result

						dispatch("profilePicture", fileContent)
					}

					reader.readAsDataURL(file)
				}
			}

			image.src = URL.createObjectURL(file)
		} else {
			uploadError = "That file type is not supported."
		}
	}
</script>

<label
	class:uploadin={state == 1}
	for="file-upload"
	class="upload"
	on:drop|preventDefault={handleDrop}
	on:dragover|preventDefault
	on:dragleave|preventDefault={() => {
		state = 0
	}}
	on:dragenter|preventDefault={() => {
		state = 1
	}}
>
	<Icon icon="material-symbols:upload" />
	<p><span>Click to upload</span> or drag and drop SVG, PNG, JPG or GIF (max. 800x800px)</p>
	{#if uploadError}
		<p><span class="errorUpload">Error:</span> {uploadError}</p>
	{/if}
	<input
		id="file-upload"
		type="file"
		hidden
		on:change={handleFileChange}
		accept=".svg, .png, .jpg, .jpeg, .gif"
	/>
</label>
