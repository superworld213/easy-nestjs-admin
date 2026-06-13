"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserStatus = void 0;
const typeorm_1 = require("typeorm");
const role_entity_1 = require("./role.entity");
const department_entity_1 = require("./department.entity");
const position_entity_1 = require("./position.entity");
const data_permission_policy_entity_1 = require("./data-permission-policy.entity");
var UserStatus;
(function (UserStatus) {
    UserStatus[UserStatus["NORMAL"] = 1] = "NORMAL";
    UserStatus[UserStatus["DISABLE"] = 2] = "DISABLE";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, default: '100' }),
    __metadata("design:type", String)
], User.prototype, "user_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: '' }),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: '' }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: '' }),
    __metadata("design:type", String)
], User.prototype, "signed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: UserStatus.NORMAL }),
    __metadata("design:type", Number)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], User.prototype, "login_ip", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "login_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "backend_setting", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: '' }),
    __metadata("design:type", String)
], User.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => role_entity_1.Role, (role) => role.users),
    (0, typeorm_1.JoinTable)({
        name: 'user_belongs_role',
        joinColumn: { name: 'user_id' },
        inverseJoinColumn: { name: 'role_id' },
    }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => department_entity_1.Department, (dept) => dept.department_users),
    (0, typeorm_1.JoinTable)({
        name: 'user_dept',
        joinColumn: { name: 'user_id' },
        inverseJoinColumn: { name: 'dept_id' },
    }),
    __metadata("design:type", Array)
], User.prototype, "departments", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => department_entity_1.Department, (dept) => dept.leaders),
    (0, typeorm_1.JoinTable)({
        name: 'dept_leader',
        joinColumn: { name: 'user_id' },
        inverseJoinColumn: { name: 'dept_id' },
    }),
    __metadata("design:type", Array)
], User.prototype, "dept_leader", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => position_entity_1.Position, (pos) => pos.users),
    (0, typeorm_1.JoinTable)({
        name: 'user_position',
        joinColumn: { name: 'user_id' },
        inverseJoinColumn: { name: 'position_id' },
    }),
    __metadata("design:type", Array)
], User.prototype, "positions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => data_permission_policy_entity_1.DataPermissionPolicy, (policy) => policy.user),
    __metadata("design:type", Array)
], User.prototype, "policies", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('user')
], User);
//# sourceMappingURL=user.entity.js.map