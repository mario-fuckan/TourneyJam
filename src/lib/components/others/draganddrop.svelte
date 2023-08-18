<script lang="ts">
	import Icon from "@iconify/svelte"
	import { createEventDispatcher } from "svelte"
	import { supabase } from "$lib/utils/supabase"
	import { v4 as uuidv4 } from "uuid"

	let state: number = 0
	let uploadError: string | undefined
	let imageUploading: boolean = false
	let input: HTMLInputElement
	const dispatch = createEventDispatcher()
	export let mode: string
	export let text: string = "max. 800x800px"

	function handleDrop(e: DragEvent) {
		imageUploading = true
		state = 0
		let files = e.dataTransfer?.files

		if (files) {
			handleFiles(files)
		}
	}

	function handleFileChange(e: any) {
		imageUploading = true
		let fileList = e.target.files
		handleFiles(fileList)
	}

	function handleFiles(files: FileList) {
		let file = files[0]

		if (file) {
			if (
				file.type == "image/jpeg" ||
				file.type == "image/png" ||
				file.type == "image/svg+xml" ||
				file.type == "image/svg" ||
				file.type == "image/gif"
			) {
				const image = new Image()

				image.onload = async () => {
					if (mode == "profile") {
						const maxWidth: number = 800
						const maxHeight: number = 800

						if (image.width > maxWidth || image.height > maxHeight) {
							uploadError = "Your image resolution is bigger than 800x800px."
							imageUploading = false
							return
						} else if (file.size / 1000000 > 2) {
							uploadError =
								"Your image is too large. Maximum allowed image size is 2MB. Your image is " +
								(file.size / 1000000).toFixed(2) +
								"MB."
							imageUploading = false
							return
						} else {
							uploadError = ""
							const { data } = await supabase.storage
								.from("profile_pictures")
								.upload(uuidv4() + ".png", file)

							dispatch(
								"profilePicture",
								"https://wxwkfcytvmlhhfacebbu.supabase.co/storage/v1/object/public/profile_pictures/" +
									data?.path
							)

							imageUploading = false
						}
					}

					if (mode == "game_background") {
						const maxWidth: number = 1920
						const maxHeight: number = 1080

						if (image.width > maxWidth || image.height > maxHeight) {
							uploadError = "Your image resolution is bigger than 1920x1080px."
							imageUploading = false
							return
						} else if (file.size / 1000000 > 3) {
							uploadError =
								"Your image is too large. Maximum allowed image size is 3MB. Your image is " +
								(file.size / 1000000).toFixed(2) +
								"MB."
							imageUploading = false
							return
						} else {
							uploadError = ""
							const { data } = await supabase.storage
								.from("game_backgrounds")
								.upload(uuidv4() + ".png", file)

							dispatch(
								"gameBackground",
								"https://wxwkfcytvmlhhfacebbu.supabase.co/storage/v1/object/public/game_backgrounds/" +
									data?.path
							)

							imageUploading = false
						}
					}

					if (mode == "game_cover") {
						const maxWidth: number = 1920
						const maxHeight: number = 1080

						if (image.width > maxWidth || image.height > maxHeight) {
							uploadError = "Your image resolution is bigger than 1920x1080px."
							imageUploading = false
							return
						} else if (file.size / 1000000 > 3) {
							uploadError =
								"Your image is too large. Maximum allowed image size is 3MB. Your image is " +
								(file.size / 1000000).toFixed(2) +
								"MB."
							imageUploading = false
							return
						} else {
							uploadError = ""
							const { data } = await supabase.storage
								.from("game_covers")
								.upload(uuidv4() + ".png", file)

							dispatch(
								"gameCover",
								"https://wxwkfcytvmlhhfacebbu.supabase.co/storage/v1/object/public/game_covers/" +
									data?.path
							)

							imageUploading = false
						}
					}

					if (mode == "tournament_cover") {
						const maxWidth: number = 1920
						const maxHeight: number = 1080

						if (image.width > maxWidth || image.height > maxHeight) {
							uploadError = "Your image resolution is bigger than 1920x1080px."
							imageUploading = false
							return
						} else if (file.size / 1000000 > 3) {
							uploadError =
								"Your image is too large. Maximum allowed image size is 3MB. Your image is " +
								(file.size / 1000000).toFixed(2) +
								"MB."
							imageUploading = false
							return
						} else {
							uploadError = ""
							const { data } = await supabase.storage
								.from("tournament_covers")
								.upload(uuidv4() + ".png", file)

							dispatch(
								"tournamentCover",
								"https://wxwkfcytvmlhhfacebbu.supabase.co/storage/v1/object/public/tournament_covers/" +
									data?.path
							)

							imageUploading = false
						}
					}
				}

				image.src = URL.createObjectURL(file)
			} else {
				uploadError = "That file type is not supported."
			}
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<label
	class:uploadin={state == 1}
	for="file-upload"
	class="upload"
	on:drop|preventDefault|self={handleDrop}
	on:dragover|preventDefault|self
	on:dragleave|preventDefault|self={() => {
		state = 0
	}}
	on:dragenter|preventDefault|self={() => {
		state = 1
	}}
	on:click|preventDefault|self={() => input.click()}
>
	<Icon icon={imageUploading ? "eos-icons:bubble-loading" : "material-symbols:upload"} />
	<p><span>Click to upload</span> or drag and drop SVG, PNG, JPG or GIF ({text}).</p>
	{#if uploadError}
		<p><span class="errorUpload">Error:</span> {uploadError}</p>
	{/if}
	<input
		id="file-upload"
		type="file"
		hidden
		on:change={handleFileChange}
		accept=".svg, .png, .jpg, .jpeg, .gif"
		bind:this={input}
	/>
</label>
