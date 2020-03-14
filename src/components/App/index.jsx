import React, {Fagment} from 'react'
import {useRoot} from 'baobab-react/hooks';
import AddPost from '../AddPost'
import Sidebar from '../Sidebar'

import syles from "./styles.css"

export default function App({store}) {
    const Root = useRoot(store);
    return <Root>
        <div styleName="wrapper">
            <div styleName="left">
                <Sidebar />
            </div>
            <div styleName="right">
                <AddPost />
            </div>
        </div>
    </Root>
}

