<script type="      ">
  const rawModules = import.meta.globEager('           ', {
    query: '    ',
    import: '       ' 
  })
  const globraw = {}
  Object.keys(rawModules).forEach((key) => {
    globraw[key] = JSON.parse(rawModules[key])
  })
  document.querySelector('        ').textContent = JSON.stringify(
    globraw,
    null,
    2
  )
</script>