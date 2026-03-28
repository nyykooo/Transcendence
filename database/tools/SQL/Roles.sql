    -- Revoke all privileges granted to dba
    REVOKE ALL PRIVILEGES ON SCHEMA dev_dba FROM dba;
    REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA dev_dba FROM dba;
    REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA dev_dba FROM dba;
    REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA dev_dba FROM dba;

    -- Alternatively, use DROP OWNED which automatically revokes privileges
    DROP OWNED BY dba CASCADE;

    -- Now drop the role
    DROP ROLE IF EXISTS dba;


    CREATE ROLE dba WITH
        LOGIN
        SUPERUSER
        CREATEROLE
        INHERIT;

    GRANT dba TO dev_dba WITH ADMIN OPTION;

    GRANT ALL PRIVILEGES ON SCHEMA dev_dba TO dba;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA dev_dba TO dba;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA dev_dba TO dba;
    GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA dev_dba TO dba;

    ALTER DEFAULT PRIVILEGES FOR ROLE dev_dba IN SCHEMA dev_dba 
        GRANT ALL PRIVILEGES ON TABLES TO dba;

    ALTER DEFAULT PRIVILEGES FOR ROLE dev_dba IN SCHEMA dev_dba 
        GRANT ALL PRIVILEGES ON SEQUENCES TO dba;

    ALTER DEFAULT PRIVILEGES FOR ROLE dev_dba IN SCHEMA dev_dba 
        GRANT ALL PRIVILEGES ON FUNCTIONS TO dba;


-- Your original setup script with syncing function
CREATE OR REPLACE FUNCTION grant_dba_and_sync(target_user text, user_email text DEFAULT NULL)
RETURNS void AS $$
DECLARE
    next_id bigint;
    email_to_use text;
BEGIN
    -- Set email
    email_to_use := COALESCE(user_email, target_user || '@example.com');
    
    -- Grant the dba role
    EXECUTE format('GRANT dba TO %I WITH ADMIN OPTION', target_user);
    
    -- Check if user already exists in dev_dba.users
    IF NOT EXISTS (SELECT 1 FROM dev_dba.users WHERE name = target_user) THEN
        -- Get next id
        BEGIN
            SELECT nextval('dev_dba.users_id_seq') INTO next_id;
        EXCEPTION
            WHEN undefined_object THEN
                SELECT COALESCE(MAX(id), 0) + 1 INTO next_id FROM dev_dba.users;
        END;
        
        -- Insert the user
        INSERT INTO dev_dba.users (
            id, role, name, password, email,
            liked, viewed, created_at, updated_at, last_login, is_active
        ) VALUES (
            next_id, 'admin', target_user, target_user,
            'CHANGE_ME', email_to_use,
            NULL, NULL,
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true
        );
        
        RAISE NOTICE 'User % granted dba role and inserted into dev_dba.users', target_user;
    ELSE
        RAISE NOTICE 'User % already exists in dev_dba.users, only dba role granted', target_user;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Create a function to sync all dba role members to dev_dba.users
CREATE OR REPLACE FUNCTION sync_dba_members_to_users()
RETURNS TABLE (
    username text,
    status text,
    message text
) AS $$
DECLARE
    member record;
    next_id bigint;
BEGIN
    -- Loop through all members of the dba role
    FOR member IN 
        SELECT m.rolname as member_name
        FROM pg_auth_members am
        JOIN pg_roles r ON r.oid = am.roleid
        JOIN pg_roles m ON m.oid = am.member
        WHERE r.rolname = 'dba'
    LOOP
        -- Check if user exists in dev_dba.users
        IF NOT EXISTS (SELECT 1 FROM dev_dba.users WHERE name = member.member_name) THEN
            -- Get next id
            BEGIN
                SELECT nextval('dev_dba.users_id_seq') INTO next_id;
            EXCEPTION
                WHEN undefined_object THEN
                    SELECT COALESCE(MAX(id), 0) + 1 INTO next_id FROM dev_dba.users;
            END;
            
            -- Insert the user
            BEGIN
                INSERT INTO dev_dba.users (
                    id, role, name, password, email,
                    liked, viewed, created_at, updated_at, last_login, is_active
                ) VALUES (
                    next_id, 'admin', member.member_name, member.member_name,
                    'CHANGE_ME', member.member_name || '@example.com',
                    NULL, NULL,
                    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true
                );
                
                username := member.member_name;
                status := 'INSERTED';
                message := 'User successfully inserted into dev_dba.users';
                RETURN NEXT;
            EXCEPTION
                WHEN OTHERS THEN
                    username := member.member_name;
                    status := 'ERROR';
                    message := SQLERRM;
                    RETURN NEXT;
            END;
        ELSE
            username := member.member_name;
            status := 'EXISTS';
            message := 'User already exists in dev_dba.users';
            RETURN NEXT;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a wrapper function to automatically sync after grants
CREATE OR REPLACE FUNCTION grant_dba_with_sync(target_role text)
RETURNS void AS $$
BEGIN
    -- Grant the dba role
    EXECUTE format('GRANT dba TO %I WITH ADMIN OPTION', target_role);
    
    -- Sync the user to dev_dba.users
    PERFORM sync_dba_members_to_users();
    
    RAISE NOTICE 'Granted dba role to % and synced to users table', target_role;
END;
$$ LANGUAGE plpgsql;


-- Now you can use the wrapper function instead of direct GRANT
-- Example usage:
-- CREATE USER guimaleo WITH ENCRYPTED PASSWORD 'ADMIN';
-- SELECT grant_dba_and_sync('guimaleo');
-- Or with custom email:
-- SELECT grant_dba_and_sync('guimaleo', 'guimaleo@mycompany.com');
-- 
-- DROP ROLE guimaleo;

-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'dev_dba' 
--   AND table_name = 'users'
-- ORDER BY ordinal_position;