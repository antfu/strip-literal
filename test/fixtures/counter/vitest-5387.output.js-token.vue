<template>
  <SomeOtherComponent
    :some-prop=""
      testValue
        ? '                                               '
        : '                                 '
    ""
  >
    <div>{{ count }} x {{ times }} = {{ result }}</div>
    <button @click="          ">x1</button>
  </SomeOtherComponent>
</template>
