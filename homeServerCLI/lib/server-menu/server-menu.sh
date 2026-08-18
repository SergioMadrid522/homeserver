#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

BACK_HOME_MENU="$DIR/../server-menu.sh"
CONFIG_FILE="$DIR/../../config/server.conf"

source "$CONFIG_FILE"
source "$SOURCE"
source "$BACK_HOME_MENU"

show_server_menu() {
    cat << "icon"
 _____                           ___  ___                 
/  ___|                          |  \/  |                 
\ `--.  ___ _ ____   _____ _ __  | .  . | ___ _ __  _   _ 
 `--. \/ _ \ '__\ \ / / _ \ '__| | |\/| |/ _ \ '_ \| | | |
/\__/ /  __/ |   \ V /  __/ |    | |  | |  __/ | | | |_| |
\____/ \___|_|    \_/ \___|_|    \_|  |_/\___|_| |_|\__,_|
                                                                                                                                                                                             
icon
    echo "1. System status"
    echo "2. Storage"
    echo "3. Logs"
    echo "4. View Backups"
    echo "5. Back to home"
}

system_status() {
    key=""
    while true; do
        read -r CPU RAM DISK ROOT_DISK <<< "$(
            ssh "$SERVER" ' 
                CPU=$(top -bn1 | awk -F"[, ]+" "/Cpu\(s\)/ {print 100 - \$8}")
                RAM=$(free | awk "/Mem:/ {printf \"%.2f\", \$3/\$2 * 100}")
                DISK=$(df /media/fabian/DATA | awk "NR==2 {print \$5}" | sed "s/%//")
                ROOT_DISK=$(df / | awk "NR==2 {print \$5}" | sed "s/%//")

                echo "$CPU $RAM $DISK $ROOT_DISK"
            '
        )"

        clear
    cat << "icon"
================================================================
 _____           _                       _        _             
/  ___|         | |                     | |      | |            
\ `--. _   _ ___| |_ ___ _ __ ___    ___| |_ __ _| |_ _   _ ___ 
 `--. \ | | / __| __/ _ \ '_ ` _ \  / __| __/ _` | __| | | / __|
/\__/ / |_| \__ \ ||  __/ | | | | | \__ \ || (_| | |_| |_| \__ \
\____/ \__, |___/\__\___|_| |_| |_| |___/\__\__,_|\__|\__,_|___/
        __/ |                                                   
       |___/                                                    
================================================================
icon
cat << EOF
======================================

  CPU                    $CPU %       
  Memory                 $RAM %       
  DATA                   $DISK %      
  Root                   $ROOT_DISK % 

======================================

Press q get back to the menu
EOF
    read -r -n 1 -t 1 key

    if [ "$key" = "q" ]; then
    printf '\033[2J\033[H'
        break
    fi
    sleep 1
done
}

#storage(){}

#logs(){}

#view_backups(){}

#exit(){}


server_menu(){
    while true; do
    show_server_menu
    read -p "Option: " option
        case $option in
            1) printf '\033[2J\033[H' && system_status;;
            2) ;;
            3) ;;
            4) ;;
            5) printf '\033[2J\033[H' && home_menu ;;
            *) ;;
        esac
    done 
}