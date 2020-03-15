import React, {Fragment} from 'react'
import { useBranch } from 'baobab-react/hooks'
import AddPost from '../../components/AddPost'
import Posts from '../../components/Posts'
import {getPosts} from '../../api'

import syles from "./styles.css"

export function Controller() {
    const {  } = useBranch({
        
    })

    return <Fragment>
        <AddPost />
        <Posts />
    </Fragment>
}

export async function loadData(tree) {
    const posts = (await getPosts()).posts
    tree.select('posts').set(posts)
    return true
}