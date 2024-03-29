<SomeOtherComponent
  :some-prop="
    testValue
      ? 'A long value to break handling of env variables'
      : 'it needs to break into a new line'
  "
>
</SomeOtherComponent>
