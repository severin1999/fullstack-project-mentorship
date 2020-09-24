import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import LinksPage from './LinksPage'
import CreatePage from './CratePage'
import DetailPage from './DetailPage'
import AuthPage from './AuthPage'

export const useRoutes = isAuth => {
    if (isAuth) {
        return (
            <Switch>
                <Route path='/links' exact>
                    <LinksPage />
                </Route>
                <Route path='/create' exact>
                    <CreatePage />
                </Route>
                <Route path='/detail/:id'>
                    <DetailPage />
                </Route>
                <Redirect to='/create' />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path='/' exact>
                <AuthPage />
            </Route>
            <Redirect to='/' />
        </Switch>
    )
}