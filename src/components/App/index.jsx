import React, {Fagment} from 'react'
import {useRoot} from 'baobab-react/hooks';
import HelloWorld from '../HelloWorld'

import syles from "./styles.css"

export default function App({store}) {
    const Root = useRoot(store);
    return <Root>
        <HelloWorld />
    </Root>
}

