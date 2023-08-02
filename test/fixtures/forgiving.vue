<script type="module">
  const rawModules = import.meta.globEager('/dir/*.json', {
    as: 'raw'
  })
  const globraw = {}
  Object.keys(rawModules).forEach((key) => {
    globraw[key] = JSON.parse(rawModules[key])
  })
  document.querySelector('.globraw').textContent = JSON.stringify(
    globraw,
    null,
    2
  )
</script>
