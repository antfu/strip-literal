<template>
  <SomeOtherComponent
    :some-prop="
      testValue
        ? 'A long value to break handling of env variables'
        : 'it needs to break into a new line'
    "
  >
    <div>{{ count }} x {{ times }} = {{ result }}</div>
    <button @click="times += 1">x1</button>
  </SomeOtherComponent>
</template>
